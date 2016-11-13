'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const gMapsClient = require('@google/maps').createClient({
  key: process.env.GMAPS_KEY
});

function geocodeData(station) {
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
}

fs.readFileAsync('./seeders/restaurants.json.orig')
  .then((data) => {
    let jsonData = JSON.parse(data.toString());
    return Promise.map(jsonData, (station) => {
      return geocodeData(station);
    });
  })
  .then((result) => console.log(JSON.stringify(result))); // eslint-disable-line no-console
