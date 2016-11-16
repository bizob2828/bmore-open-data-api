'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const ValidatorMock = require('../mocks/validator').ValidatorMock;

chai.use(sinonChai);

describe('create validator tests', () => {
  let CreateValidator;

  beforeEach(function() {
    CreateValidator = proxyquire('lib/create-validator', { 'declare-validator': { 'Middleware': ValidatorMock } });
  });

  it('should instantiate the validator', function() {
    const next = sinon.stub();
    let validator = new CreateValidator({}, {}, next);
    expect(validator.getConfig()[0].name).to.equal('name');
    expect(validator.getConfig()[1].name).to.equal('zip');
    expect(validator.getConfig()[2].name).to.equal('hood');
    expect(validator.getConfig()[3].name).to.equal('address');
    expect(validator.getConfig()[4].name).to.equal('station_id');
  });
});
