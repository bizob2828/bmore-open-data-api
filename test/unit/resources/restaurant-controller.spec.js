'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const _ = require('lodash');

chai.use(require('sinon-chai'));

describe('restaurant controller tests', function() {
  const req = {
    baseUrl: '/api',
    _parsedUrl: { pathname: '/resource' },
    query: {},
    params: {},
    body: {}
  };
  const res = {};
  const geoMock = {};

  let restaurantMock, stationMock, controller;

  beforeEach(function() {
    geoMock.getGeoData = sinon.stub();
    stationMock = sinon.stub();

    restaurantMock = {
      findAndCountAll: sinon.stub(),
      findOne: sinon.stub(),
      destroy: sinon.stub(),
      create: sinon.stub(),
      update: sinon.stub()
    };

    res.respond = sinon.stub();
    res.error = sinon.stub();

    controller = proxyquire('../../../resources/restaurant-controller', {
      '../models': { Restaurants: restaurantMock, PoliceStations: stationMock },
      'lib/get-geo-data': geoMock
    });
  });

  describe('getAll tests', function() {
    it('should respond with appropriate data', function() {
      restaurantMock.findAndCountAll.resolves({
        rows: [{ dataValues: 'foo' }, { dataValues: 'baz' }],
        count: 500
      });

      return controller.getAll(req, res).then(() => {
        expect(res.respond.args[0]).to.deep.equal([
          ['foo', 'baz'],
          200,
          [
            { rel: 'next', href: '/api/resource?limit=100&page=2' },
            { rel: 'last', href: '/api/resource?limit=100&page=5' }
          ],
          500
        ]);

        expect(res.error.callCount).to.equal(0);
      });
    });

    it('should filter by police stations when qp is passed in', function() {
      restaurantMock.findAndCountAll.resolves({ rows: [] });
      req.query.station_id = '8';
      return controller.getAll(req, res).then(() => {
        expect(restaurantMock.findAndCountAll.args[0][0].where).to.deep.equal({
          stationId: 8
        });
      });
    });

    it('should use limit/page qp when passed in', function() {
      restaurantMock.findAndCountAll.resolves({ rows: [], count: 500 });
      req.query.limit = 10;
      req.query.page = 15;
      return controller.getAll(req, res).then(() => {
        expect(res.respond.args[0][2]).to.deep.equal([
          { rel: 'first', href: '/api/resource?limit=10&page=1' },
          { rel: 'prev', href: '/api/resource?limit=10&page=14' },
          { rel: 'next', href: '/api/resource?limit=10&page=16' },
          { rel: 'last', href: '/api/resource?limit=10&page=50' }
        ]);
      });
    });

    it('should respond with error when findAndCountAll call fails', function() {
      const err = new Error('no restaurants');
      restaurantMock.findAndCountAll.rejects(err);

      return controller.getAll(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([
          err,
          'Unable to get all restaurants'
        ]);
      });
    });
  });

  describe('get tests', function() {
    beforeEach(function() {
      req.params.restaurantId = 1;
    });

    it('should return a restaurant', function() {
      restaurantMock.findOne.resolves({ dataValues: 'restaurant' });

      return controller.get(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0][0]).to.equal('restaurant');
      });
    });

    it('should return 404 if restaurant id is not found', function() {
      restaurantMock.findOne.resolves(0);

      return controller.get(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([
          { message: 'Restaurant not found' },
          404
        ]);
      });
    });

    it('should return error for unexpected error', function() {
      const error = new Error('db error');
      restaurantMock.findOne.rejects(error);

      return controller.get(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([
          error,
          'Unable to retrieve restaurant'
        ]);
      });
    });
  });

  describe('delete tests', function() {
    beforeEach(function() {
      req.params.restaurantId = 1;
    });

    it('should delete a restaurant', function() {
      restaurantMock.destroy.resolves('done');
      return controller.delete(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([{}, 204]);
      });
    });

    it('should return 404 on delete when restaurant does not exist', function() {
      restaurantMock.destroy.resolves(0);
      return controller.delete(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([
          { message: 'Restaurant not found' },
          404
        ]);
      });
    });

    it('should throw error for unexpected error during delete', function() {
      const error = new Error('no delete for you');
      restaurantMock.destroy.rejects(error);
      return controller.delete(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([
          error,
          'Unable to delete restaurant'
        ]);
      });
    });
  });

  describe('create tests', function() {
    it('should create a restaurant', function() {
      const createData = {};
      const latLong = { lat: 30, long: 10 };
      const body = {
        name: 'rest',
        zip: 21211,
        hood: 'Hampden',
        address: '700 34th',
        station_id: 1
      };

      _.merge(createData, latLong, body);
      geoMock.getGeoData.resolves(latLong);
      req.body = body;
      restaurantMock.create.resolves({ dataValues: createData });

      return controller.create(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0][0]).to.deep.equal(createData);
      });
    });

    it('should throw error for unexpected error', function() {
      const error = new Error('create failed');
      geoMock.getGeoData.resolves({});
      restaurantMock.create.rejects(error);

      return controller.create(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([
          error,
          'Unable to create restaurant'
        ]);
      });
    });

    it('should should throw error if getting geo data fails', function() {
      const error = new Error('geo data failed');
      geoMock.getGeoData.rejects(error);

      return controller.create(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([
          error,
          'Unable to create restaurant'
        ]);
      });
    });
  });

  describe('update tests', function() {
    it('should update a restaurant', function() {
      restaurantMock.update.resolves(['done']);
      return controller.update(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0][0]).to.deep.equal({
          message: 'Restaurant updated'
        });
      });
    });

    it('should update lat long if req.geoData exists', function() {
      const req = { params: {}, body: {} };
      req.geoData = { lat: 0, long: 0 };
      req.body.address = 'foobar';
      req.params.restaurantId = 1;
      restaurantMock.update.resolves(['done']);
      return controller.update(req, res).then(() => {
        expect(restaurantMock.update.args[0][0]).to.deep.equal({
          address: 'foobar',
          lat: 0,
          long: 0,
          hood: undefined,
          name: undefined,
          stationId: undefined,
          zip: undefined
        });
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0][0]).to.deep.equal({
          message: 'Restaurant updated'
        });
      });
    });

    it('should return 404 on update when restaurant does not exist', function() {
      restaurantMock.update.resolves([]);
      return controller.update(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([
          { message: 'Restaurant not found' },
          404
        ]);
      });
    });

    it('should throw error for unexpected error during delete', function() {
      const error = new Error('update failed');
      restaurantMock.update.rejects(error);
      return controller.update(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([
          error,
          'Unable to update restaurant'
        ]);
      });
    });
  });
});
