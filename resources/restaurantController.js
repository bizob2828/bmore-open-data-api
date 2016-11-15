'use strict';
const restaurantModel = require('../models').Restaurants;
const policeStationModel = require('../models').PoliceStations;
const _ = require('lodash');
const utils = require('../utils/get-geo-data');
const constants = require('../utils/constants');

module.exports.getAll = (req, res) => {
  let limit = parseInt(req.query.limit) || 100
    , page = parseInt(req.query.page) || 1
    , stationId = parseInt(req.query.station_id)
    , params = {
      limit: limit,
      offset: page,
      include: [{ model: policeStationModel, as: 'police_station', attributes: constants.STATION_COLUMNS }],
      attributes: constants.RESTAURANT_COLUMNS
    };

  // filter by stationId if qp is passed in
  if (stationId) {
    params.where = { stationId: stationId };
  }

  return restaurantModel.findAll(params).then((results) => {
    let url = `${req.baseUrl}${req._parsedUrl.pathname}`;
    res.respond(_.map(results, (data) => data.dataValues), 200, [
      { rel: 'first', href: `${url}?limit=${limit}&page=1` },
      { rel: 'prev', href: `${url}?limit=${limit}&page=${page}` },
      { rel: 'next', href: `${url}?limit=${limit}&page=${page + 1}`}
    ]);
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to get all restaurants');
  });
};

module.exports.get = (req, res) => {
  return restaurantModel.findOne({
    where: { id: req.params.restaurantId },
    include: [ { model: policeStationModel, as: 'police_station', attributes: constants.STATION_COLUMNS } ],
    attributes: constants.RESTAURANT_COLUMNS
  })
  .then((results) => {
    if (results) {
      res.respond(results.dataValues);
    } else {
      res.respond({ message: 'Resource Not Found' }, 404);
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
      res.respond({ message: 'Resource Not Found' }, 404);
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
    res.respond(results.dataValues, 200);
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to create restaurant');
  });
};

module.exports.update = (req, res) => {
  return restaurantModel.update(req.body, { where: { id: req.params.restaurantId } }).then((results) => {
    if (results[0]) {
      res.respond({ message: 'Restaurant updated' }, 200);
    } else {
      res.respond({ message: 'Resource Not Found' }, 404);
    }
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to update restaurant');
  });
};
