(function (app) {
  'use strict';

  app.registerModule('curriculum');
  app.registerModule('curriculum.services');
  app.registerModule('curriculum.routes', ['ui.router', 'curriculum.services']);
})(ApplicationConfiguration);
