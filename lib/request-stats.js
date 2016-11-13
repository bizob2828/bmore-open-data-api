'use strict';
const onHeaders = require('on-headers');
const memwatch = require('memwatch-next');
const _ = require('lodash');

module.exports = deets;

function deets() {

  return (req, res, next) => {
    // used to get heap when req starts
    let hd = new memwatch.HeapDiff()
      // used to get mem usage when request starts
      , memStart = process.memoryUsage().rss;

    // hook when headers are about to be set
    onHeaders(res, () => {
      let now = process.memoryUsage().rss
        , totalMem = now - memStart
        , stringObjects = _.find(hd.end().change.details, (key) => key.what === 'String');

      res.setHeader('X-Total-Mem-Usage', totalMem * 1e-6);
      res.setHeader('X-String-Objects', stringObjects['+']);

    });

    next();
  }

}
