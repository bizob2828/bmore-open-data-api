'use strict';
const stationModel = require('../models').PoliceStations;
const _ = require('lodash');

module.exports.getAll = (req, res) => {
  return stationModel.findAll()
    .then((results) => {
      res.respond(_.map(results, (data) => data.dataValues));
    });
};
