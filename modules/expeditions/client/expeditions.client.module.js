(function (app) {
  'use strict';

  app.registerModule('expeditions');
  app.registerModule('expeditions.services');
  app.registerModule('expeditions.routes', ['ui.router', 'expeditions.services']);
})(ApplicationConfiguration);
