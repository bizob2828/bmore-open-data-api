'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.INTEGER
      },
      hood: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.FLOAT
      },
      long: {
        type: Sequelize.FLOAT
      },
      stationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PoliceStations',
          key: 'id'
        }
      }
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Restaurants');
  }
};
