'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('app setup test', () => {
  it('should setup app accordingly', () => {
    let app = { use: sinon.stub() }
      , paramStub = { init: sinon.stub() }
      , bodyParserStub = { json: sinon.stub(), urlencoded: sinon.stub() }
      , appSetup = proxyquire('../../app', {
        'response-time': sinon.stub(),
        './lib/request-stats': sinon.stub(),
        './lib/util-middleware': sinon.stub(),
        'body-parser': bodyParserStub,
        'declare-validator': paramStub
      });

    appSetup.setup(app);
    expect(app.use.callCount).to.equal(8);
    expect(paramStub.init.callCount).to.equal(1);

  });

});
