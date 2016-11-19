'use strict';
const responseTime = require('response-time');
const requestStats = require('./lib/request-stats');
const utilMiddleware = require('./lib/util-middleware');
const resources = require('./resources');
const bodyParser = require('body-parser');
const paramValidator = require('declare-validator');
const cors = require('cors');


module.exports.setup = function(app) {
  app.use(cors());
  app.use(requestStats());
  app.use(responseTime());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({extended: true}));
  paramValidator.init(app);
  app.use(utilMiddleware.response);
  app.use(utilMiddleware.formattedError);
  app.use('/api/', resources);
};
