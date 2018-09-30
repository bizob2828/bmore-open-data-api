'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));

describe('util middleware tests', () => {
  let next, req, res, utilsMiddleware, winstonMock, configMock;

  beforeEach(() => {
    configMock = { instrumentation: { enabled: true } };
    winstonMock = {
      add: sinon.stub(),
      log: sinon.stub(),
      transports: { File: 'foo' }
    };
    next = sinon.stub();
    req = {};
    res = {};
    res.header = sinon.stub().returns(res);
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub();
    res._headers = {
      'x-total-mem-usage': 10,
      'x-response-time': '30ms',
      'x-string-objects': 100
    };

    utilsMiddleware = proxyquire('lib/util-middleware', {
      config: configMock,
      winston: winstonMock
    });
  });

  describe('res.respond', () => {
    beforeEach('setup respond', () => {
      expect(res.respond, 'respond is not present').to.not.be.a('function');
      utilsMiddleware.response(req, res, next);
    });

    it('should get attached', () => {
      expect(res.respond, 'respond has been attached').to.be.a('function');
      expect(next.callCount).to.equal(1);
    });

    it('should respond successfully', () => {
      const body = { test: 'This is my res.respond body' };
      res.respond(body, 9001);

      expect(res.status.args[0][0]).to.equal(9001);
      expect(res.header.callCount).to.equal(1);
      expect(res.send.args[0][0]).to.equal(
        '{"results":{"test":"This is my res.respond body"}}'
      );
    });

    it('should respond with a 200 if no code is provided', () => {
      res.respond([]);
      expect(res.status.args[0][0]).to.equal(200);
    });

    it('should attach links to body if specified', () => {
      res.respond('foo', 200, 'links');
      expect(res.send.args[0][0]).to.equal('{"results":"foo","links":"links"}');
    });

    it('should attach count if specified', () => {
      res.respond('foo', 200, 'links', 100);
      expect(res.send.args[0][0]).to.equal(
        '{"results":"foo","links":"links","total_count":100}'
      );
    });

    it('should call winston if instrumentation is enabled', () => {
      res.respond('foo');
      expect(winstonMock.log.args[0][1]).to.equal(
        'Response Time: 30ms, Memory Used: 10, String Objects: 100'
      );
    });

    it('should call not winston if instrumentation is disabled', () => {
      configMock.instrumentation.enabled = false;
      res.respond('foo');
      expect(winstonMock.log.callCount).to.equal(0);
    });
  });

  describe('res.error', () => {
    beforeEach('setup respond', () => {
      expect(res.error, 'error is not present').to.not.be.a('function');
      utilsMiddleware.formattedError(req, res, next);
    });

    it('should get attached', () => {
      expect(res.error, 'error has been attached').to.be.a('function');
      expect(next.callCount).to.equal(1);
    });

    it('should default to 500 and send err.message', () => {
      res.error(new Error('my error'));

      expect(res.status.args[0][0]).to.equal(500);
      expect(res.header.callCount).to.equal(1);
      expect(res.send.args[0][0]).to.equal('{"errors":"my error"}');
    });

    it('should use code and msg passed in to res.error', () => {
      res.error(null, 'my error message', 400);

      expect(res.status.args[0][0]).to.equal(400);
      expect(res.send.args[0][0]).to.equal('{"errors":"my error message"}');
    });

    it('should call winston if instrumentation is enabled', () => {
      res.error(new Error('foo'));
      expect(winstonMock.log.args[0][1]).to.equal(
        'Response Time: 30ms, Memory Used: 10, String Objects: 100'
      );
    });

    it('should call not winston if instrumentation is disabled', () => {
      configMock.instrumentation.enabled = false;
      res.error(new Error('foo'));
      expect(winstonMock.log.callCount).to.equal(0);
    });
  });
});
