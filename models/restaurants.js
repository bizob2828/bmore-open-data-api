'use strict';
module.exports = function restaurants(sequelize, DataTypes) {
  const Restaurants = sequelize.define(
    'Restaurants',
    {
      name: DataTypes.STRING,
      zip: DataTypes.INTEGER,
      hood: DataTypes.STRING,
      address: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      long: DataTypes.FLOAT
    },
    {
      timestamps: false
    }
  );

  Restaurants.associate = function associate(models) {
    Restaurants.belongsTo(models.PoliceStations, {
      foreignKey: 'stationId',
      as: 'police_station'
    });
  };

  return Restaurants;
};
