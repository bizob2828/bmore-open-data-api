'use strict';
const chai = require('chai');
const expect = chai.expect;
const request = require('./request');

describe('Station tests', function() {
  it('should return stations', function() {
    return request('get', '/api/police-stations').then((results) => {
      expect(results.statusCode).to.equal(200);
      expect(Object.keys(results.body.results[0])).to.deep.equal([
        'id',
        'name',
        'zip',
        'hood',
        'address',
        'lat',
        'long'
      ]);
    });
  });
});
