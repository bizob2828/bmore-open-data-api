'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = {
  up(queryInterface) {
    return fs
      .readFileAsync('./seeders/police-stations.json')
      .then((policeStations) =>
        queryInterface.bulkInsert('PoliceStations', JSON.parse(policeStations))
      )
      .then(() => fs.readFileAsync('./seeders/restaurants.json'))
      .then((restaurants) =>
        queryInterface.bulkInsert('Restaurants', JSON.parse(restaurants))
      );
  },

  down(queryInterface) {
    return queryInterface
      .bulkDelete('Restaurants', null, {})
      .then(() => queryInterface.bulkDelete('PoliceStations', null, {}));
  }
};
