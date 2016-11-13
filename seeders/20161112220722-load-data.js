'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = {
  up: function(queryInterface) {
    return fs.readFileAsync('./seeders/police-stations.json')
      .then((policeStations) => {
        return queryInterface.bulkInsert('PoliceStations', JSON.parse(policeStations));
      })
      .then(() => {
        return fs.readFileAsync('./seeders/restaurants.json');
      })
      .then((restaurants) => {
        return queryInterface.bulkInsert('Restaurants', JSON.parse(restaurants));
      });
  },

  down: function(queryInterface) {
    return queryInterface.bulkDelete('Restaurants', null, {})
      .then(() => {
        return queryInterface.bulkDelete('PoliceStations', null, {});
      });
  }
};
