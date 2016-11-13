'use strict';
const responseTime = require('response-time');
const requestStats = require('./lib/request-stats');
const utilMiddleware = require('./lib/util-middleware');
const resources = require('./resources');
const bodyParser = require('body-parser');


module.exports.setup = (app) => {
  app.use(requestStats());
  app.use(responseTime());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(utilMiddleware.response);
  app.use('/api/', resources);
};
