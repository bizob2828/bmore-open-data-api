'use strict';
const stationModel = require('../models').PoliceStations;
const _ = require('lodash');

/**
 * Returns a list of police stations
 * @param {Object} req request object
 * @param {Object} res response object
 * @return {Promise}
 */
module.exports.getAll = (req, res) => {
  return stationModel.findAll()
    .then((results) => {
      res.respond(_.map(results, (data) => data.dataValues));
    })
    .catch((err) => {
      res.error(err, 500, 'Unable to get all police stations');
    });
};
