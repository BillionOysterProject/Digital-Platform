(function (app) {
  'use strict';

  app.registerModule('units');
  app.registerModule('units.services');
  app.registerModule('units.routes', ['ui.router', 'units.services']);
})(ApplicationConfiguration);
