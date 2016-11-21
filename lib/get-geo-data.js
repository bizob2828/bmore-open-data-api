'use strict';
const Promise = require('bluebird');
const gMapsClient = require('@google/maps').createClient({
  key: process.env.GMAPS_KEY
});
const _ = require('lodash');

/**
 * Looks up lat/long based on address
 * @param {Object} place object that has the address and zip
 */
module.exports.getGeoData = function geocodeData(place) {
  return new Promise((resolve, reject) => {
    gMapsClient.geocode({ address: `${place.address} ${place.zip}`}, (err, result) => {
      if (err) {
        reject(err);
      }

      let location = _.get(result.json.results[0], 'geometry.location', { lat: 0, lng: 0});
      place.lat = location.lat;
      place.long = location.lng;
      return resolve(place);
    });
  });
};

