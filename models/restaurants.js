'use strict';
module.exports = function(sequelize, DataTypes) {
  var Restaurants = sequelize.define('Restaurants', {
    name: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    hood: DataTypes.STRING,
    address: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        Restaurants.belongsTo(models.PoliceStations, {
          foreignKey: 'id',
          as: 'stationId'
        });
      }
    }
  });
  return Restaurants;
};
