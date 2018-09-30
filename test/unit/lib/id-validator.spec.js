'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const ValidatorMock = require('../mocks/validator').ValidatorMock;

chai.use(sinonChai);

describe('id validator tests', () => {
  let IdValidator;

  beforeEach(function() {
    IdValidator = proxyquire('lib/id-validator', {
      'declare-validator': { Middleware: ValidatorMock }
    });
  });

  it('should instantiate the validator', function() {
    const next = sinon.stub();
    const validator = new IdValidator({}, {}, next);
    expect(validator.getConfig()[0].name).to.equal('restaurantId');
  });
});
