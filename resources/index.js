'use strict';
const app = require('express')();
const policeController = require('./policeController');
const restaurants = require('./restaurantController');

app.route('/police-stations')
  .get(policeController.get);

app.route('/restaurants')
  .get(restaurants.get);

module.exports = app;
