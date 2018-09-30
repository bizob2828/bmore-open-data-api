'use strict';
/**
 * Utility used to take open data and add lat/long to them
 */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const utils = require('lib/get-geo-data');

fs.readFileAsync('./seeders/restaurants.json.orig')
  .then((data) => {
    const jsonData = JSON.parse(data.toString());
    return Promise.map(jsonData, (station) => utils.getGeoData(station));
  })
  .then((result) => console.log(JSON.stringify(result))); // eslint-disable-line no-console
