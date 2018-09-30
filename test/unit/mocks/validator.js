'use strict';
// eslint-disable-next-line max-params
module.exports.ValidatorMock = function ValidatorMock(req, res, next, config) {
  this.getConfig = function getConfig() {
    return config;
  };

  next();
};
