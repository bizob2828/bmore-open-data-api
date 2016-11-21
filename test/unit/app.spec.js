'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

describe('app setup test', () => {
  let app
    , appSetup
    , configMock
    , paramStub;

  beforeEach(() => {
    let bodyParserStub = { json: sinon.stub(), urlencoded: sinon.stub() };

    paramStub = { init: sinon.stub() };
    app = { use: sinon.stub() };
    configMock = { instrumentation: {}};

    appSetup = proxyquire('../../app', {
      'config': configMock,
      'response-time': sinon.stub(),
      './lib/request-stats': sinon.stub(),
      './lib/util-middleware': sinon.stub(),
      'body-parser': bodyParserStub,
      'declare-validator': paramStub
    });

  });

  it('should setup app accordingly', () => {
    configMock.instrumentation.enabled = true;
    appSetup.setup(app);
    expect(app.use.callCount).to.equal(8);
    expect(paramStub.init.callCount).to.equal(1);

  });

  it('should not register instrumentation middleware when config flag is disabled', () => {
    configMock.instrumentation.enabled = false;
    appSetup.setup(app);
    expect(app.use.callCount).to.equal(6);
    expect(paramStub.init.callCount).to.equal(1);

  });

});
