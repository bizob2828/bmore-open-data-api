'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const utils = require('lib/get-geo-data');

fs.readFileAsync('./seeders/restaurants.json.orig')
  .then((data) => {
    let jsonData = JSON.parse(data.toString());
    return Promise.map(jsonData, (station) => {
      return utils.getGeoData(station);
    });
  })
  .then((result) => console.log(JSON.stringify(result))); // eslint-disable-line no-console
