'use strict';

/**
 * Module dependencies
 */
var standardPolicy = require('../policies/meta-ccls-mathematics.server.policy'),
  standards = require('../controllers/meta-ccls-mathematics.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/ccls-mathematics').all(standardPolicy.isAllowed)
    .get(standards.list)
    .post(standards.create);

  // Single standard routes
  app.route('/api/ccls-mathematics/:standardId').all(standardPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the standard middleware
  app.param('standardId', standards.standardByID);
};
