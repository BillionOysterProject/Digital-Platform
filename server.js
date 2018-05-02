'use strict';

var Raven = require('raven');

switch (process.env.NODE_ENV) {
  case 'production':
    Raven.config('https://765e170adcc642febcf1ca28f795918c@sentry.io/1200029').install();
    break;
}

var app = require('./config/lib/app');
var server = app.start();
