'use strict';

/**
 * Module dependencies
 */
var standardPolicy = require('../policies/meta-ngss-cross-cutting-concepts.server.policy'),
  standards = require('../controllers/meta-ngss-cross-cutting-concepts.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/ngss-cross-cutting-concepts').all(standardPolicy.isAllowed)
    .get(standards.list)
    .post(standards.create);

  // Single standard routes
  app.route('/api/ngss-cross-cutting-concepts/:standardId').all(standardPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the standard middleware
  app.param('standardId', standards.standardByID);
};
