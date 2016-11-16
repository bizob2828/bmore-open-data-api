'use strict';

const util = require('util');
const Validator = require('declare-validator').Middleware;


/**
 *
 * Validator for the parameters used to create a restaurant
 *
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next method
 */
function IdValidator(req, res, next) {
  let config = [
    {
      name: 'restaurantId',
      validation: [
        {
          method: 'isInt',
          message: '`restaurantId` must be an int'
        }
      ]
    }
  ];

  Validator.call(this, req, res, next, config);
}

util.inherits(Validator, IdValidator);

module.exports = IdValidator;
