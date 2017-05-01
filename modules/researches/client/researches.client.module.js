(function (app) {
  'use strict';

  app.registerModule('researches');
  app.registerModule('researches.services');
  app.registerModule('researches.routes', ['ui.router', 'researches.services']);
}(ApplicationConfiguration));
