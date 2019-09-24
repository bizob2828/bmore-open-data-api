'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));

describe.skip('request stats tests', function() {
  const HeapDiff = function() {};
  let next, req, res, memMock, onHeaders, requestStats;

  beforeEach(function() {
    next = sinon.stub();
    req = {};
    res = {};
    res.setHeader = sinon.stub();

    memMock = {
      HeapDiff
    };

    HeapDiff.prototype.end = () => ({
      change: { details: [{ what: 'String', '+': 100 }] }
    });

    process.memoryUsage = sinon.stub();
    process.memoryUsage.onCall(0).returns({ rss: 100 });
    process.memoryUsage.onCall(1).returns({ rss: 500 });

    onHeaders = sinon.stub();

    requestStats = proxyquire('lib/request-stats', {
      'on-headers': onHeaders,
      'memwatch-next': memMock
    });
  });

  it('should set appropriate x headers', function() {
    onHeaders.yields();
    const stats = requestStats();
    stats(req, res, next);
    expect(res.setHeader.args[0]).to.deep.equal([
      'X-Total-Mem-Usage',
      0.00039999999999999996
    ]);
    expect(res.setHeader.args[1]).to.deep.equal(['X-String-Objects', 100]);
  });
});
