(function (app) {
  'use strict';

  app.registerModule('protocol-site-conditions');
  app.registerModule('protocol-site-conditions.services');
  app.registerModule('protocol-site-conditions.routes', ['ui.router', 'protocol-site-conditions.services']);
})(ApplicationConfiguration);
