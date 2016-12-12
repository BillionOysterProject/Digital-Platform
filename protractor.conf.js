'use strict';

// Protractor configuration
var config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['modules/*/tests/e2e/*.js'],
  // capabilities: {
  //   browserName: 'phantomjs',
  //   version: '',
  //   platform: 'ANY'
  // },
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 600000
  }
};

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
