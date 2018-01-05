'use strict';

var proxy = require('http-proxy-middleware');

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Define page that renders content as whole page
  app.route('/full-page/*').get(core.renderFullPage);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Handle reverse proxying to Github Pages
  app.all([
    '/info',
    '/info/*',
  ], proxy({
    target:       'https://billionoysterproject.github.io',
    changeOrigin: true,
    autoRewrite:  true,
    pathRewrite: {
      '^/info': '/Digital-Platform/',
    },
    logLevel: 'debug',
  }));

  // Define application route
  app.route('/*').get(core.renderIndex);
};
