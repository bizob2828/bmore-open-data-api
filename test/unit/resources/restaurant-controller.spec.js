'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const _ = require('lodash');

chai.use(require('sinon-chai'));

describe('restaurant controller tests', () => {
  let restaurantMock
    , stationMock
    , req = { baseUrl: '/api', _parsedUrl: { pathname: '/resource' }, query: {}, params: {}, body: {}}
    , res = {}
    , controller
    , geoMock = {};

  beforeEach(() => {
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

  describe('getAll tests', () => {
    it('should respond with appropriate data', () => {
      restaurantMock.findAndCountAll.resolves({ rows: [
        { dataValues: 'foo' },
        { dataValues: 'baz' }
      ], count: 500});

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

    it('should filter by police stations when qp is passed in', () => {
      restaurantMock.findAndCountAll.resolves({ rows: [] });
      req.query.station_id = '8';
      return controller.getAll(req, res).then(() => {
        expect(restaurantMock.findAndCountAll.args[0][0].where).to.deep.equal({ stationId: 8 });
      });

    });

    it('should use limit/page qp when passed in', () => {
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

    it('should respond with error when findAndCountAll call fails', () => {
      let err = new Error('no restaurants');
      restaurantMock.findAndCountAll.rejects(err);

      return controller.getAll(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([err, 500, 'Unable to get all restaurants']);
      });

    });
  });

  describe('get tests', () => {
    beforeEach(() => {
      req.params.restaurantId = 1;
    });

    it('should return a restaurant', () => {
      restaurantMock.findOne.resolves({ dataValues: 'restaurant' });

      return controller.get(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0][0]).to.equal('restaurant');
      });

    });

    it('should return 404 if restaurant id is not found', () => {
      restaurantMock.findOne.resolves(0);

      return controller.get(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([{ message: 'Restaurant not found' }, 404]);

      });

    });

    it('should throw 500 for unexpected error', () => {
      let error = new Error('db error');
      restaurantMock.findOne.rejects(error);

      return controller.get(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([error, 500, 'Unable to retrieve restaurant']);

      });

    });
  });

  describe('delete tests', () => {
    beforeEach(() => {
      req.params.restaurantId = 1;
    });

    it('should delete a restaurant', () => {
      restaurantMock.destroy.resolves('done');
      return controller.delete(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([{}, 204]);
      });

    });

    it('should return 404 on delete when restaurant does not exist', () => {
      restaurantMock.destroy.resolves(0);
      return controller.delete(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([{ message: 'Restaurant not found' }, 404]);
      });

    });

    it('should throw 500 for unexpected error during delete', () => {
      let error = new Error('no delete for you');
      restaurantMock.destroy.rejects(error);
      return controller.delete(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([error, 500, 'Unable to delete restaurant']);
      });

    });
  });

  describe('create tests', () => {
    it('should create a restaurant', () => {
      let createData = {}
        , latLong = { lat: 30, long: 10}
        , body = { name: 'rest', zip: 21211, hood: 'Hampden', address: '700 34th', station_id: 1 };

      _.merge(createData, latLong, body);
      geoMock.getGeoData.resolves(latLong);
      req.body = body;
      restaurantMock.create.resolves({ dataValues: createData });

      return controller.create(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0][0]).to.deep.equal(createData);
      });
    });

    it('should throw 500 for unexpected error', () => {
      let error = new Error('create failed');
      geoMock.getGeoData.resolves();
      restaurantMock.create.rejects(error);

      return controller.create(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([ error, 500, 'Unable to create restaurant']);
      });

    });

    it('should should throw 500 if getting geo data fails', () => {
      let error = new Error('geo data failed');
      geoMock.getGeoData.rejects(error);

      return controller.create(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([ error, 500, 'Unable to create restaurant']);
      });
    });
  });

  describe('update tests', () => {
    it('should update a restaurant', () => {
      restaurantMock.update.resolves(['done']);
      return controller.update(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0][0]).to.deep.equal({ message: 'Restaurant updated'});
      });

    });

    it('should update lat long if req.geoData exists', () => {
      let req = { params: {}, body: {} };
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
        expect(res.respond.args[0][0]).to.deep.equal({ message: 'Restaurant updated'});
      });

    });

    it('should return 404 on update when restaurant does not exist', () => {
      restaurantMock.update.resolves([]);
      return controller.update(req, res).then(() => {
        expect(res.error.callCount).to.equal(0);
        expect(res.respond.args[0]).to.deep.equal([{ message: 'Restaurant not found' }, 404]);
      });

    });

    it('should throw 500 for unexpected error during delete', () => {
      let error = new Error('update failed');
      restaurantMock.update.rejects(error);
      return controller.update(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([error, 500, 'Unable to update restaurant']);
      });

    });

  });

});

