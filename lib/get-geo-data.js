'use strict';
const Promise = require('bluebird');
const gMapsClient = require('@google/maps').createClient({
  key: process.env.GMAPS_KEY
});

module.exports.getGeoData = function geocodeData(station) {
  return new Promise((resolve, reject) => {
    gMapsClient.geocode({ address: `${station.address} ${station.zip}`}, (err, result) => {
      if (err) {
        reject(err);
      }

      let location = result.json.results[0].geometry.location;
      station.lat = location.lat;
      station.long = location.lng;
      return resolve(station);
    });
  });
};

