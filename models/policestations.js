'use strict';
module.exports = function(sequelize, DataTypes) {
  var PoliceStations = sequelize.define('PoliceStations', {
    name: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    hood: DataTypes.STRING,
    address: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        PoliceStations.hasMany(models.Restaurants);
      }
    }
  });
  return PoliceStations;
};
