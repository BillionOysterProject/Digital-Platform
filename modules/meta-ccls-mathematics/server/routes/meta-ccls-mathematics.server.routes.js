'use strict';

/**
 * Module dependencies
 */
var metaCclsMathPolicy = require('../policies/meta-ccls-mathematics.server.policy'),
  metaCclsMaths = require('../controllers/meta-ccls-mathematics.server.controller');

module.exports = function (app) {
  // Single standard routes
  app.route('/api/ccls-mathematics/:metaCclsMathId').all(metaCclsMathPolicy.isAllowed)
    .get(metaCclsMaths.read)
    .put(metaCclsMaths.update)
    .delete(metaCclsMaths.delete);

  // Standard collection routes
  app.route('/api/ccls-mathematics').all(metaCclsMathPolicy.isAllowed)
    .get(metaCclsMaths.list)
    .post(metaCclsMaths.create);

  // Finish by binding the standard middleware
  app.param('metaCclsMathId', metaCclsMaths.standardByID);
};
