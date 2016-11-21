'use strict';
const chai = require('chai');
const expect = chai.expect;
const request = require('./request');
const helpers = require('./helpers');
const baseUrl = '/api/restaurants';

describe('CRUD Tests', () => {
  describe('get collection', () => {
    it('should return restaurants', () => {
      return helpers.getRestaurants().then((results) => {
        let result = results.body.results[0];
        expect(results.statusCode).to.equal(200);
        expect(Object.keys(result)).to.deep.equal(['id', 'name', 'address', 'zip', 'hood', 'lat', 'long', 'police_station']);
        expect(Object.keys(result.police_station)).to.deep.equal(['id', 'name']);
        expect(results.body.links.length).to.equal(2);
        expect(Object.keys(results.body.links[0])).to.deep.equal(['rel', 'href']);
        expect(typeof results.body.total_count).to.equal('number');
      });
    });

    it('should retrieve a page of station by station', () => {
      return helpers.getRestaurants(2, 2).then((results) => {
        expect(results.statusCode).to.equal(200);
        expect(results.body.links.length).to.equal(4);
      });
    });
  });

  describe('get restaurant', () => {
    it('should return 400 when id is invalid', () => {
      return request('get', `${baseUrl}/foo`).catch((results) => {
        expect(results.statusCode).to.equal(400);
      });

    });

    it('should return restaurant', () => {
      var restaurant;
      return helpers.getRestaurants().then((results) => {
        restaurant = results.body.results[0];
        return request('get', `${baseUrl}/${restaurant.id}`);
      })
      .then((results) => {
        expect(results.statusCode).to.equal(200);
        expect(results.body.results).to.deep.equal(restaurant);
      });

    });

    it('should return 404 when restaurant id not found', () => {
      return request('get', `${baseUrl}/999999999999`).catch((results) => {
        expect(results.statusCode).to.equal(404);
      });

    });
  });

  describe('create restaurant', () => {
    it('should return 400 when missing required fields', () => {
      return request('post', baseUrl).catch((err) => {
        expect(err.statusCode).to.equal(400);
      });

    });

    it('should create a restaurant', () => {
      return helpers.createRestaurant('Bob Evans').then((results) => {
        expect(results.statusCode).to.equal(200);
      });

    });
  });

  describe('edit restaurant', () => {
    it('should update restaurant', () => {
      var restId;
      return helpers.createRestaurant('FooBar').then((results) => {
        restId = results.body.results.id;
        return request('put', `${baseUrl}/${restId}`, { address: '100 Lancaster St', name: 'BeerHaus' });
      })
      .then((results) => {
        expect(results.statusCode).to.equal(200);
        return request('get', `${baseUrl}/${restId}`);
      })
      .then((results) => {
        let result = results.body.results;
        expect(result.name).to.equal('BeerHaus');
        expect(result.address).to.equal('100 Lancaster St');
      });
    });

    it('should return 404 when restaurant id not found', () => {
      return request('put', `${baseUrl}/999999999999`, { hood: 'Hampden' }).catch((results) => {
        expect(results.statusCode).to.equal(404);
      });

    });

  });

  describe('delete restaurant', () => {
    it('should delete restaurant', () => {
      return helpers.createRestaurant('Testing').then((results) => {
        return request('delete', `${baseUrl}/${results.body.results.id}`);

      })
      .then((results) => {
        expect(results.statusCode).to.equal(204);
      });

    });

    it('should return 404 when restaurant does not exist', () => {
      return request('delete', `${baseUrl}/9934223492`)
        .catch((err) => {
          expect(err.statusCode).to.equal(404);
        });
    });

  });

});
