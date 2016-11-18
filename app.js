'use strict';
const responseTime = require('response-time');
const requestStats = require('./lib/request-stats');
const utilMiddleware = require('./lib/util-middleware');
const resources = require('./resources');
const bodyParser = require('body-parser');
const paramValidator = require('declare-validator');


module.exports.setup = function(app) {
  app.all('/api/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
    next();
  });
  app.use(requestStats());
  app.use(responseTime());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({extended: true}));
  paramValidator.init(app);
  app.use(utilMiddleware.response);
  app.use(utilMiddleware.formattedError);
  app.use('/api/', resources);
};
