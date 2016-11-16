'use strict';

/**
 * This file loads all of our unit test deps once, so we don't have to load
 * them for every individual unit test file
 */

before(function() {
  require('sinon-as-promised');
});
