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
function generateLinks({ url, page, limit, totalCount }) {
  const links = [];

  if (page !== 1) {
    links.push({ rel: 'first', href: `${url}?limit=${limit}&page=1` });
    links.push({ rel: 'prev', href: `${url}?limit=${limit}&page=${page - 1}` });
  }

  links.push({ rel: 'next', href: `${url}?limit=${limit}&page=${page + 1}` });
  links.push({
    rel: 'last',
    href: `${url}?limit=${limit}&page=${Math.ceil(
      parseInt(totalCount) / parseInt(limit)
    )}`
  });

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
  const limit = parseInt(req.query.limit) || 100;
  const page = parseInt(req.query.page) || 1;
  const stationId = parseInt(req.query.station_id);
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const params = {
    limit,
    offset,
    order: [['name', 'ASC']],
    include: [
      {
        model: policeStationModel,
        as: 'police_station',
        attributes: constants.STATION_COLUMNS
      }
    ],
    attributes: constants.RESTAURANT_COLUMNS
  };

  // filter by stationId if qp is passed in
  if (stationId) {
    params.where = { stationId };
  }

  return restaurantModel
    .findAndCountAll(params)
    .then((results) => {
      const links = generateLinks({
        url: `${req.baseUrl}${req._parsedUrl.pathname}`,
        page,
        limit,
        totalCount: results.count
      });
      res.respond(
        _.map(results.rows, (data) => data.dataValues),
        200,
        links,
        results.count
      );
    })
    .catch((err) => {
      res.error(err, 'Unable to get all restaurants');
    });
};

/**
 * Returns a restaurant by id
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
module.exports.get = ({ params: { restaurantId: id } }, res) =>
  restaurantModel
    .findOne({
      order: [['name', 'ASC']],
      where: { id },
      include: [
        {
          model: policeStationModel,
          as: 'police_station',
          attributes: constants.STATION_COLUMNS
        }
      ],
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
      res.error(err, 'Unable to retrieve restaurant');
    });

/**
 * Deletes a restaurant by id
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
module.exports.delete = ({ params: { restaurantId: id } }, res) =>
  restaurantModel
    .destroy({ where: { id } })
    .then((results) => {
      if (results) {
        res.respond({}, 204);
      } else {
        res.respond({ message: 'Restaurant not found' }, 404);
      }
    })
    .catch((err) => {
      res.error(err, 'Unable to delete restaurant');
    });

/**
 * Creates a restaurant
 * Valid params(req.body): name, zip, hood, address, station_id
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
module.exports.create = (req, res) => {
  const { name, zip, hood, address, station_id: stationId } = req.body;
  return utils
    .getGeoData({ address, zip })
    .then(({ lat, long }) =>
      restaurantModel.create({
        name,
        zip,
        hood,
        address,
        stationId,
        lat,
        long
      })
    )
    .then(({ dataValues }) => {
      res.respond(dataValues);
    })
    .catch((err) => {
      res.error(err, 'Unable to create restaurant');
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
  const updateOpts = {
    name: req.body.name,
    zip: req.body.zip,
    hood: req.body.hood,
    address: req.body.address,
    stationId: req.body.station_id
  };

  if (req.geoData) {
    updateOpts.lat = req.geoData.lat;
    updateOpts.long = req.geoData.long;
  }

  return restaurantModel
    .update(updateOpts, { where: { id: req.params.restaurantId } })
    .then((results) => {
      if (results[0]) {
        res.respond({ message: 'Restaurant updated' });
      } else {
        res.respond({ message: 'Restaurant not found' }, 404);
      }
    })
    .catch((err) => {
      res.error(err, 'Unable to update restaurant');
    });
};
