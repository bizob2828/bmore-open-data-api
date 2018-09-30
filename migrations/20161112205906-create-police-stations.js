'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('PoliceStations', {
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
      }
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('PoliceStations');
  }
};
