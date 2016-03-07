(function (app) {
  'use strict';

  app.registerModule('protocol-mobile-traps');
  app.registerModule('protocol-mobile-traps.services');
  app.registerModule('protocol-mobile-traps.routes', ['ui.router', 'protocol-mobile-traps.services']);
})(ApplicationConfiguration);
