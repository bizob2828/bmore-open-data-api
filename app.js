'use strict';
const responseTime = require('response-time');
//const requestStats = require('./lib/request-stats');
const utilMiddleware = require('./lib/util-middleware');
const resources = require('./resources');
const bodyParser = require('body-parser');
const paramValidator = require('declare-validator');
const cors = require('cors');
const config = require('config');

module.exports.setup = function setup(app) {
  app.use(cors());

  // only enable instrumentation middleware when config flag is enabled
  if (config.instrumentation.enabled) {
    //app.use(requestStats());
    app.use(responseTime());
  }
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  paramValidator.init(app);
  app.use(utilMiddleware.response);
  app.use(utilMiddleware.formattedError);
  app.use('/api/', resources);
};
