'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('app setup test', function() {
  let app, appSetup, configMock, paramStub;

  beforeEach(function() {
    const bodyParserStub = { json: sinon.stub(), urlencoded: sinon.stub() };

    paramStub = { init: sinon.stub() };
    app = { use: sinon.stub() };
    configMock = { instrumentation: {} };

    appSetup = proxyquire('../../app', {
      config: configMock,
      './resources': sinon.stub(),
      'response-time': sinon.stub(),
      './lib/request-stats': sinon.stub(),
      './lib/util-middleware': sinon.stub(),
      'body-parser': bodyParserStub,
      'declare-validator': paramStub
    });
  });

  it('should setup app accordingly', function() {
    configMock.instrumentation.enabled = true;
    appSetup.setup(app);
    expect(app.use.callCount).to.equal(8);
    //expect(app.use.callCount).to.equal(7);
    expect(paramStub.init.callCount).to.equal(1);
  });

  it('should not register instrumentation middleware when config flag is disabled', function() {
    configMock.instrumentation.enabled = false;
    appSetup.setup(app);
    expect(app.use.callCount).to.equal(6);
    expect(paramStub.init.callCount).to.equal(1);
  });
});
