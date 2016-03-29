(function (app) {
  'use strict';

  app.registerModule('library');
  app.registerModule('library.services');
  app.registerModule('library.routes', ['ui.router', 'library.services']);
})(ApplicationConfiguration);
