'use strict';
const Promise = require('bluebird');
const gMapsClient = require('@google/maps').createClient({
  key: process.env.GMAPS_KEY
});
const geocodeAsync = Promise.promisify(gMapsClient.geocode);
const _ = require('lodash');

/**
 * Looks up lat/long based on address
 * @param {Object} place object that has the address and zip
 */
module.exports.getGeoData = function getGeoData(place) {
  return geocodeAsync({
    address: `${place.address} ${place.zip}`
  }).then((result) => {
    const location = _.get(result, 'json.results.0.geometry.location', {
      lat: 0,
      lng: 0
    });
    place.lat = location.lat;
    place.long = location.lng;
    return place;
  });
};
