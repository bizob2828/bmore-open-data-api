'use strict';
const restaurantModel = require('../models').Restaurants;
const _ = require('lodash');

module.exports.get = (req, res) => {
  let limit = parseInt(req.query.limit, 10) || 100;
  let page = parseInt(req.query.page, 10) || 1;
  console.log(`limit ${limit} page ${page}`);
  return restaurantModel.findAll({ limit: limit, offset: page })
    .then((results) => {
      res.respond(_.map(results, (data) => data.dataValues));
    });
}
