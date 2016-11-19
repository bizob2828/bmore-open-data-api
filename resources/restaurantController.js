'use strict';
const restaurantModel = require('../models').Restaurants;
const policeStationModel = require('../models').PoliceStations;
const _ = require('lodash');
const utils = require('lib/get-geo-data');
const constants = require('lib/constants');

function generateLinks(url, page, limit) {
  let links = [];

  if (page !== 1) {
    links.push({ rel: 'first', href: `${url}?limit=${limit}&page=1` });
    links.push({ rel: 'prev', href: `${url}?limit=${limit}&page=${page - 1}` });
  }

  links.push({ rel: 'next', href: `${url}?limit=${limit}&page=${page + 1}`});

  return links;
}

module.exports.getAll = (req, res) => {
  let limit = parseInt(req.query.limit) || 100
    , page = parseInt(req.query.page) || 1
    , stationId = parseInt(req.query.station_id)
    , offset = page === 1 ? 0 : (page - 1) * limit
    , params = {
      limit: limit,
      offset: offset,
      order: 'name ASC',
      include: [{ model: policeStationModel, as: 'police_station', attributes: constants.STATION_COLUMNS }],
      attributes: constants.RESTAURANT_COLUMNS
    };

  // filter by stationId if qp is passed in
  if (stationId) {
    params.where = { stationId: stationId };
  }

  return restaurantModel.findAndCountAll(params).then((results) => {
    let links = generateLinks(`${req.baseUrl}${req._parsedUrl.pathname}`, page, limit);
    res.respond(_.map(results.rows, (data) => data.dataValues), 200, links, results.count);
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to get all restaurants');
  });
};

module.exports.get = (req, res) => {
  return restaurantModel.findOne({
    order: 'nameASC',
    where: { id: req.params.restaurantId },
    include: [ { model: policeStationModel, as: 'police_station', attributes: constants.STATION_COLUMNS } ],
    attributes: constants.RESTAURANT_COLUMNS
  })
  .then((results) => {
    if (results) {
      res.respond(results.dataValues);
    } else {
      res.respond({ message: 'Restaurant not found' }, 404);
    }
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to retrieve restaurant');
  });

};

module.exports.delete = (req, res) => {
  return restaurantModel.destroy({ where: { id: req.params.restaurantId }}).then((results) => {
    if (results) {
      res.respond({}, 204);
    } else {
      res.respond({ message: 'Restaurant not found' }, 404);
    }
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to delete restaurant');
  });
};

module.exports.create = (req, res) => {
  return utils.getGeoData({ address: req.body.address, zip: req.body.zip }).then((geoData) => {
    return restaurantModel.create({
      name: req.body.name,
      zip: req.body.zip,
      hood: req.body.hood,
      address: req.body.address,
      stationId: req.body.station_id,
      lat: geoData.lat,
      long: geoData.long
    });
  })
  .then((results) => {
    res.respond(results.dataValues);
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to create restaurant');
  });
};

module.exports.update = (req, res) => {
  return restaurantModel.update(req.body, { where: { id: req.params.restaurantId } }).then((results) => {
    if (results[0]) {
      res.respond({ message: 'Restaurant updated' });
    } else {
      res.respond({ message: 'Restaurant not found' }, 404);
    }
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to update restaurant');
  });
};
