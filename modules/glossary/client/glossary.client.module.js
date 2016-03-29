(function (app) {
  'use strict';

  app.registerModule('glossary');
  app.registerModule('glossary.services');
  app.registerModule('glossary.routes', ['ui.router', 'glossary.services']);
})(ApplicationConfiguration);
