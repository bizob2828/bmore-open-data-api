'use strict';
const utils = require('./get-geo-data');

/**
 * Middleware to get new lat/long if address/zip has changed
 * Sets lat/long on req.geoData
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next function
 */
module.exports = (req, res, next) => {
  if (req.body.zip || req.body.address) {
    return utils.getGeoData({ address: req.body.address, zip: req.body.zip}).then((geoData) => {
      req.geoData = geoData;
      next();
    })
    .catch(next);
  }

  next();

};
