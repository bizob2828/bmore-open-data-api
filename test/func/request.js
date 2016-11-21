'use strict';
const request = require('supertest');
const Promise = require('bluebird');
const _ = require('lodash');

var app;

/**
 * Utility function for making requests in functional tests
 *
 * Usage:
 * return request('delete', 'some/endpoint', payload).then(function (res) {
 *         expect(res.statusCode).to.equal(204);
 *       });
 *
 *
 * @param method {String} - http method, in lowercase. e.g. 'get', 'post', 'put', 'delete', 'patch'
 * @param url {String} - url of the endpoint
 * @param payload {Object} - payload for post, put, etc bodys/payloads
 * @returns {*|promise}
 */
module.exports = function(method, url, payload) {
  return new Promise((resolve, reject) => {
    var call;

    // make sure app was setup
    if (typeof app === 'undefined') {
      reject(new Error('Setup must be called prior to calling request'));
    } else {
      // so we don't get undefined errors if payload isn't supplied
      if (typeof payload === 'undefined') {
        payload = {};
      }

      // setup the request
      call = request(app)[method](url);
      call.set('Content-Type', 'application/json');

      // send and end
      call.send(payload)
        .end(function(err, res) {
          if (err || res.statusCode >= 300) {

            if (!_.isError(err)) {
              err = extractErrorFromResponse(res);
            }

            reject(err);
          } else {
            resolve(res);
          }
        });
    }
  });

};

/**
 * Pulls error info from response
 *
 * @param response {object} - supertest response object
 * @returns
 */
function extractErrorFromResponse(response) {
  let errMessage = _.get(response, 'body.errors[0]')
    , err = new Error();

  // only get stuff we need
  err.response = _.pick(response, ['body', 'statusCode', 'headers']);
  err.message = errMessage ? JSON.stringify(errMessage) : 'There has been an error.  Please inspect the error object for more information.';

  // alias status on base obj for backwards compatibility
  err.status = err.response.statusCode;
  err.statusCode = err.status;

  return err;
}


/**
 * Provides a onetime setup of the express App so that the express app doesn't need to be passed in to each request call
 *
 * Usage:
 *    testSuite.request.setup(app);
 *
 * @param expressApp {*|Express} - the express app object
 */
module.exports.setup = function(expressApp) {
  app = expressApp;
};

/**
 * Returns express instance so it can be injected elsewhere
 */
module.exports.getApp = function() {
  return app;
};
