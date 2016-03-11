(function (app) {
  'use strict';

  app.registerModule('protocol-water-quality');
  app.registerModule('protocol-water-quality.services');
  app.registerModule('protocol-water-quality.routes', ['ui.router', 'protocol-water-quality.services']);
})(ApplicationConfiguration);
