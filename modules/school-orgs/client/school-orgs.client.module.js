(function (app) {
  'use strict';

  app.registerModule('school-orgs');
  app.registerModule('school-orgs.services');
  app.registerModule('school-orgs.routes', ['ui.router', 'school-orgs.services']);
})(ApplicationConfiguration);
