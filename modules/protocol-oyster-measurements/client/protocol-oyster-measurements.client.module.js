(function (app) {
  'use strict';

  app.registerModule('protocol-oyster-measurements');
  app.registerModule('protocol-oyster-measurements.services');
  app.registerModule('protocol-oyster-measurements.routes', ['ui.router', 'protocol-oyster-measurements.services']);
})(ApplicationConfiguration);
