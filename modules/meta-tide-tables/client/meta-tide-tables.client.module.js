(function (app) {
  'use strict';

  app.registerModule('meta-tide-tables');
  app.registerModule('meta-tide-tables.services');
  app.registerModule('meta-tide-tables.routes', ['ui.router', 'meta-tide-tables.services']);
})(ApplicationConfiguration);
