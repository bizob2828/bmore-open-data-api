'use strict';
const config = require('config');
const winston = require('winston');

winston.add(winston.transports.File, { filename: 'instrumentation.log' });

function addInstrumentation(res) {
  let headers = res._headers;
  winston.log('info', `Response Time: ${headers['x-response-time']}, Memory Used: ${headers['x-total-mem-usage']}, String Objects: ${headers['x-string-objects']}`);
}

/**
 * Middleware for sending responses
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next middleware
 */
module.exports.response = (req, res, next) => {
  /**
   * Convenience method to send success responses
   * { results: 'my results', links: <paging links here>, total_count: 100 }
   * @param {Object} body response body
   * @param {Int} code http code to return, defaults to 200
   * @param {Array} links array of links to return
   * @param {Int} count total count of objects in request
   */
  res.respond = function(body, code, links, count) {
    code = code || 200;
    body = {results: body};
    if (links) {
      body.links = links;
    }

    if (count) {
      body.total_count = count;
    }

    res.header('Content-Type', 'application/json');
    res.status(code).send(JSON.stringify(body));

    // only log out instrumentation when config flag is enabled
    if (config.instrumentation.enabled) {
      addInstrumentation(res);
    }
  };

  next();
};

/**
 * Middleware for sending error responses
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next middleware
 */
module.exports.formattedError = (req, res, next) => {
  /**
   * Convenience method to send formatted errors { errors: 'my error' }
   * @param {Object} err error message from server
   * @param {String} msg msg to display on response
   * @param {Int} code http response code to return, defaults to 500
   */
  res.error = (err, msg, code) => {
    let errorBody = msg || err.message
      , errCode = code || 500;

    res.header('Content-Type', 'application/json');
    res.status(errCode).send(JSON.stringify({ errors: errorBody }));
    // only log out instrumentation when config flag is enabled
    if (config.instrumentation.enabled) {
      addInstrumentation(res);
    }
  };

  next();

};
