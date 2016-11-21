'use strict';
const chai = require('chai');
const expect = chai.expect;
const request = require('./request');
const config = require('config');
const helpers = require('./helpers');

describe('Instrumentation Test', () => {
  before(() => {
    let app = require('express')();
    config.instrumentation.enabled = true;
    require('../../app').setup(app);
    request.setup(app);
  });

  after(() => {
    let app = require('express')();
    config.instrumentation.enabled = false;
    require('../../app').setup(app);
    request.setup(app);
  });

  it('should add instrumentation to requests', () => {
    return helpers.getRestaurants().then((results) => {
      expect(results.headers['x-total-mem-usage']).to.exist;
      expect(results.headers['x-string-objects']).to.exist;
      expect(results.headers['x-response-time']).to.exist;
    });

  });

});
