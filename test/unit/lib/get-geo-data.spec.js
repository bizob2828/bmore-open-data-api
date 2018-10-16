'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

describe('geodata tests', function() {
  let gmapsMock, geoCodeMock, getGeo;

  beforeEach(function() {
    geoCodeMock = { geocode: sinon.stub() };
    gmapsMock = {
      createClient: sinon.stub().returns(geoCodeMock)
    };

    getGeo = proxyquire('lib/get-geo-data', {
      '@google/maps': gmapsMock
    });
  });

  it('should return lat/long on success', function() {
    geoCodeMock.geocode.yields(null, {
      json: { results: [{ geometry: { location: { lat: 10, lng: 10 } } }] }
    });
    return getGeo.getGeoData({ address: '1', zip: 21211 }).then((station) => {
      expect(station.address).to.equal('1');
      expect(station.zip).to.equal(21211);
      expect(station.lat).to.equal(10);
      expect(station.long).to.equal(10);
    });
  });

  it('should return error on failure', function() {
    geoCodeMock.geocode.yields('my err');
    return expect(getGeo.getGeoData({})).to.have.been.rejected;
  });
});
