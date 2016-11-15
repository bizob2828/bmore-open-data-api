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
    timestamps: false,
    classMethods: {
      associate: function(models) {
        Restaurants.belongsTo(models.PoliceStations, {
          foreignKey: 'stationId',
          as: 'police_station'
        });
      }
    }
  });

  return Restaurants;
};
