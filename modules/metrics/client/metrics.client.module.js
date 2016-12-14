(function (app) {
  'use strict';

  app.registerModule('metrics');
  app.registerModule('metrics.services');
  app.registerModule('metrics.routes', ['ui.router', 'metrics.services']);
})(ApplicationConfiguration);
