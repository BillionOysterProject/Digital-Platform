(function (app) {
  'use strict';

  app.registerModule('protocol-settlement-tiles');
  app.registerModule('protocol-settlement-tiles.services');
  app.registerModule('protocol-settlement-tiles.routes', ['ui.router', 'protocol-settlement-tiles.services']);
})(ApplicationConfiguration);
