'use strict';

// Protractor configuration
var config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['modules/*/tests/e2e/*.js']
};

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
