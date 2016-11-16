'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));

describe('police controller tests', () => {
  let modelMock
    , req = {}
    , res = {}
    , controller;

  beforeEach(() => {
    modelMock = {
      findAll: sinon.stub()
    };

    res.respond = sinon.stub();
    res.error = sinon.stub();
    controller = proxyquire('../../../resources/policeController', {
      '../models': { PoliceStations: modelMock }
    });
  });

  describe('getAll tests', () => {
    it('should respond with appropriate data', () => {
      modelMock.findAll.resolves([
        { dataValues: 'foo' },
        { dataValues: 'bar' },
        { dataValues: 'baz' }
      ]);

      return controller.getAll(req, res).then(() => {
        expect(res.respond.args[0][0]).to.deep.equal(['foo', 'bar', 'baz']);
        expect(res.error.callCount).to.equal(0);
      });

    });

    it('should respond with error when findAll call fails', () => {
      let err = new Error('no stations');
      modelMock.findAll.rejects(err);

      return controller.getAll(req, res).then(() => {
        expect(res.respond.callCount).to.equal(0);
        expect(res.error.args[0]).to.deep.equal([err, 500, 'Unable to get all police stations']);
      });

    });
  });

});

