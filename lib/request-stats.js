'use strict';
/*const onHeaders = require('on-headers');
const memwatch = require('memwatch-next');
const _ = require('lodash');

module.exports = deets;

/**
 * Request tuning used to obtain total memory usage and number of string objects during request
 * Note: Since Node.js is async there could be many requests happening at once
 * It sets the values above on X headers: X-Total-Mem-Usage and X-String-Objects
function deets() {
  return (req, res, next) => {
    // used to get heap when req starts
    const hd = new memwatch.HeapDiff();
    // used to get mem usage when request starts
    const memStart = process.memoryUsage().rss;

    // hook when headers are about to be set
    onHeaders(res, () => {
      const now = process.memoryUsage().rss;
      const totalMem = now - memStart;
      const stringObjects = _.find(
        hd.end().change.details,
        (key) => key.what === 'String'
      );

      res.setHeader('X-Total-Mem-Usage', totalMem * 1e-6);
      res.setHeader('X-String-Objects', stringObjects['+']);
    });

    next();
  };
}*/
