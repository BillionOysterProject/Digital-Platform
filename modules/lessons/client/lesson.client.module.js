(function (app) {
  'use strict';

  app.registerModule('lessons');
  app.registerModule('lessons.services');
  app.registerModule('lessons.routes', ['ui.router', 'lessons.services']);
})(ApplicationConfiguration);

