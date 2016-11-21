'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));

describe('edit lookup tests', () => {
  let utilsMock
    , editLookup
    , req
    , res
    , next;

  beforeEach(() => {
    req = { body: {} };
    next = sinon.stub();

    utilsMock = {
      getGeoData: sinon.stub()
    };

    editLookup = proxyquire('lib/edit-lookup', {
      './get-geo-data': utilsMock
    });

  });

  it('should get geodata if zip exists', () => {
    req.body.zip = 21211;
    utilsMock.getGeoData.resolves('foo');
    return editLookup(req, res, next).then(() => {
      expect(req.geoData).to.equal('foo');
      expect(next.callCount).to.equal(1);
    });
  });

  it('should get geodata if address exists', () => {
    req.body.address = '616 w 33rd';
    utilsMock.getGeoData.resolves('bar');
    return editLookup(req, res, next).then(() => {
      expect(req.geoData).to.equal('bar');
      expect(next.callCount).to.equal(1);
    });
  });

  it('should call next if no address or zip', () => {
    editLookup(req, res, next);
    expect(next.callCount).to.equal(1);
    expect(req.geoData).to.equal(undefined);
  });

  it('should call next if getGeoData fails', () => {
    req.body.address = '616 w 33rd';
    utilsMock.getGeoData.rejects();
    return editLookup(req, res, next).then(() => {
      expect(req.geoData).to.equal(undefined);
      expect(next.callCount).to.equal(1);
    });

  });
});
