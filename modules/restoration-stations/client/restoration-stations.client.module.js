(function (app) {
  'use strict';

  app.registerModule('restoration-stations');
  app.registerModule('restoration-stations.services');
  app.registerModule('restoration-stations.routes', ['ui.router', 'restoration-stations.services']);
})(ApplicationConfiguration);
