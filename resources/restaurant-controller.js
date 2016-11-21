'use strict';
const restaurantModel = require('../models').Restaurants;
const policeStationModel = require('../models').PoliceStations;
const _ = require('lodash');
const utils = require('lib/get-geo-data');
const constants = require('lib/constants');

/**
 * Create links for response
 * @param {String} url url of request
 * @param {Int} page number
 * @param {Int} limit limit on request
 * @param {Int} totalCount number of db records
 */
function generateLinks(url, page, limit, totalCount) {
  let links = [];

  if (page !== 1) {
    links.push({ rel: 'first', href: `${url}?limit=${limit}&page=1` });
    links.push({ rel: 'prev', href: `${url}?limit=${limit}&page=${page - 1}` });
  }

  links.push({ rel: 'next', href: `${url}?limit=${limit}&page=${page + 1}`});
  links.push({ rel: 'last', href: `${url}?limit=${limit}&page=${Math.ceil(parseInt(totalCount) / parseInt(limit))}`});

  return links;
}

/**
 * Returns a list of restaurants
 * Defaults to limit 100, page 1
 * To filter by station pass in req.query.station_id <id of police station>
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
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
    let links = generateLinks(`${req.baseUrl}${req._parsedUrl.pathname}`, page, limit, results.count);
    res.respond(_.map(results.rows, (data) => data.dataValues), 200, links, results.count);
  })
  .catch((err) => {
    res.error(err, 500, 'Unable to get all restaurants');
  });
};

/**
 * Returns a restaurant by id
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
module.exports.get = (req, res) => {
  return restaurantModel.findOne({
    order: 'name ASC',
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

/**
 * Deletes a restaurant by id
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
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

/**
 * Creates a restaurant
 * Valid params(req.body): name, zip, hood, address, station_id
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
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

/**
 * Updates a restaurant by id
 * Valid params(req.body): name, zip, hood, address, station_id
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
module.exports.update = (req, res) => {
  return restaurantModel.update({
    name: req.body.name,
    zip: req.body.zip,
    hood: req.body.hood,
    address: req.body.address,
    stationId: req.body.station_id
  }, { where: { id: req.params.restaurantId } }).then((results) => {
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
