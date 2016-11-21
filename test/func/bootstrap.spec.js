'use strict';
const app = require('express')();
const request = require('./request');

before(() => {
  require('../../app').setup(app);
  request.setup(app);
});
