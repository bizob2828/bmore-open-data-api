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
function CreateValidator(req, res, next) {
  const config = [
    {
      name: 'name',
      validation: [
        {
          method: 'notEmpty',
          message: '`name` is required'
        }
      ]
    },
    {
      name: 'zip',
      validation: [
        {
          method: 'isInt',
          message: '`zip` must be an int'
        }
      ]
    },
    {
      name: 'hood',
      validation: [
        {
          method: 'notEmpty',
          message: '`hood` is required'
        }
      ]
    },
    {
      name: 'address',
      validation: [
        {
          method: 'notEmpty',
          message: '`address` is required'
        }
      ]
    },
    {
      name: 'station_id',
      validation: [
        {
          method: 'notEmpty',
          message: '`station_id` is required'
        }
      ]
    }
  ];

  Validator.call(this, req, res, next, config);
}

util.inherits(Validator, CreateValidator);

module.exports = CreateValidator;
