'use strict';
module.exports.ValidatorMock = function(req, res, next, config) {
  this.getConfig = function() {
    return config;
  };

  next();

};
