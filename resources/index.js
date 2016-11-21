'use strict';
const app = require('express')();
const policeController = require('./police-controller');
const restaurants = require('./restaurant-controller');
const CreateValidator = require('lib/create-validator');
const IdValidator = require('lib/id-validator');
const addressLookup = require('lib/edit-lookup');

app.route('/police-stations')
  .get(policeController.getAll);

app.route('/restaurants')
  .get(restaurants.getAll)
  .post(CreateValidator, restaurants.create);

app.route('/restaurants/:restaurantId')
  .all(IdValidator)
  .get(restaurants.get)
  .delete(restaurants.delete)
  .put(addressLookup, restaurants.update);

module.exports = app;
