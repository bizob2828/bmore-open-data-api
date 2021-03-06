'use strict';
const chai = require('chai');
const expect = chai.expect;
const request = require('./request');
const helpers = require('./helpers');
const baseUrl = '/api/restaurants';

describe('CRUD Tests', function() {
  describe('get collection', function() {
    it('should return restaurants', function() {
      return helpers.getRestaurants().then((results) => {
        expect(results.headers['x-total-mem-usage']).to.not.exist;
        expect(results.headers['x-string-objects']).to.not.exist;
        expect(results.headers['x-response-time']).to.not.exist;
        const result = results.body.results[0];
        expect(results.statusCode).to.equal(200);
        expect(Object.keys(result)).to.deep.equal([
          'id',
          'name',
          'address',
          'zip',
          'hood',
          'lat',
          'long',
          'police_station'
        ]);
        expect(Object.keys(result.police_station)).to.deep.equal([
          'id',
          'name'
        ]);
        expect(results.body.links.length).to.equal(2);
        expect(Object.keys(results.body.links[0])).to.deep.equal([
          'rel',
          'href'
        ]);
        expect(typeof results.body.total_count).to.equal('number');
      });
    });

    it('should retrieve a page of station by station', function() {
      return helpers.getRestaurants(2, 2).then((results) => {
        expect(results.statusCode).to.equal(200);
        expect(results.body.links.length).to.equal(4);
      });
    });
  });

  describe('get restaurant', function() {
    it('should return 400 when id is invalid', function() {
      return request('get', `${baseUrl}/foo`).catch((results) => {
        expect(results.statusCode).to.equal(400);
      });
    });

    it('should return restaurant', function() {
      let restaurant;
      return helpers
        .getRestaurants()
        .then((results) => {
          restaurant = results.body.results[0];
          return request('get', `${baseUrl}/${restaurant.id}`);
        })
        .then((results) => {
          expect(results.statusCode).to.equal(200);
          expect(results.body.results).to.deep.equal(restaurant);
        });
    });

    it('should return 404 when restaurant id not found', function() {
      return request('get', `${baseUrl}/999999999999`).catch((results) => {
        expect(results.statusCode).to.equal(404);
      });
    });
  });

  describe('create restaurant', function() {
    it('should return 400 when missing required fields', function() {
      return request('post', baseUrl).catch((err) => {
        expect(err.statusCode).to.equal(400);
      });
    });

    it('should create a restaurant', function() {
      return helpers.createRestaurant('Bob Evans').then((results) => {
        expect(results.statusCode).to.equal(200);
      });
    });
  });

  describe('edit restaurant', function() {
    it('should update restaurant', function() {
      let restId, lat, long;
      return helpers
        .createRestaurant('FooBar')
        .then((results) => {
          restId = results.body.results.id;
          lat = results.body.results.lat;
          long = results.body.results.long;
          return request('put', `${baseUrl}/${restId}`, {
            address: '100 Lancaster St Baltimore MD',
            name: 'BeerHaus'
          });
        })
        .then((results) => {
          expect(results.statusCode).to.equal(200);
          return request('get', `${baseUrl}/${restId}`);
        })
        .then((results) => {
          const result = results.body.results;
          expect(result.name).to.equal('BeerHaus');
          expect(result.address).to.equal('100 Lancaster St Baltimore MD');
          expect(result.lat).to.not.equal(lat);
          expect(result.long).to.not.equal(long);
        });
    });

    it('should return 404 when restaurant id not found', function() {
      return request('put', `${baseUrl}/999999999999`, {
        hood: 'Hampden'
      }).catch((results) => {
        expect(results.statusCode).to.equal(404);
      });
    });
  });

  describe('delete restaurant', function() {
    it('should delete restaurant', function() {
      return helpers
        .createRestaurant('Testing')
        .then((results) =>
          request('delete', `${baseUrl}/${results.body.results.id}`)
        )
        .then((results) => {
          expect(results.statusCode).to.equal(204);
        });
    });

    it('should return 404 when restaurant does not exist', function() {
      return request('delete', `${baseUrl}/9934223492`).catch((err) => {
        expect(err.statusCode).to.equal(404);
      });
    });
  });
});
