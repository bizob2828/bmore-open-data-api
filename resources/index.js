'use strict';
const app = require('express')();
const policeController = require('./policeController');
const restaurants = require('./restaurantController');
const CreateValidator = require('../lib/create-validator');
const IdValidator = require('../lib/id-validator');

app.route('/police-stations')
  .get(policeController.getAll);

app.route('/restaurants')
  .get(restaurants.getAll)
  .post(CreateValidator, restaurants.create);

app.route('/restaurants/:restaurantId')
  .all(IdValidator)
  .get(restaurants.get)
  .delete(restaurants.delete)
  .put(restaurants.update);

module.exports = app;
