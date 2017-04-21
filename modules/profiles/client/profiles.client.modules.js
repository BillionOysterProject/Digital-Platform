(function (app) {
  'use strict';

  app.registerModule('profiles');
  app.registerModule('profiles.services');
  app.registerModule('profiles.routes', ['ui.router', 'profiles.services']);
})(ApplicationConfiguration);
