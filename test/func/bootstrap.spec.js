'use strict';
const app = require('express')();
const request = require('./request');

before(function() {
  require('../../app').setup(app);
  request.setup(app);
});
