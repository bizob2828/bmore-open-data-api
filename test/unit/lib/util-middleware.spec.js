'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('util middleware tests', () => {
  let next
    , req
    , res
    , utilsMiddleware;

  beforeEach(() => {
    next = sinon.stub();
    req = {};
    res = {};
    res.header = sinon.stub().returns(res);
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub();

    utilsMiddleware = require('lib/util-middleware');
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
      let body = { test: 'This is my res.respond body' };
      res.respond(body, 9001);

      expect(res.status.args[0][0]).to.equal(9001);
      expect(res.header.callCount).to.equal(1);
      expect(res.send.args[0][0]).to.equal('{"results":{"test":"This is my res.respond body"}}');

    });

    it('should respond with a 200 if no code is provided', () => {
      res.respond([]);
      expect(res.status.args[0][0]).to.equal(200);
    });

    it('should attach links to body if specified', () => {
      res.respond('foo', 200, 'links');
      expect(res.send.args[0][0]).to.equal('{"results":"foo","links":"links"}');

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

  });

});
