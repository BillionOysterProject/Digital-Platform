(function (app) {
  'use strict';

  app.registerModule('events');
  app.registerModule('events.services');
  app.registerModule('events.routes', ['ui.router', 'events.services']);
}(ApplicationConfiguration));
