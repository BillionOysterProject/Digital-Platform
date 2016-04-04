'use strict';

/**
 * Module dependencies
 */
var standardPolicy = require('../policies/meta-ngss-disciplinary-core-ideas.server.policy'),
  standards = require('../controllers/meta-ngss-disciplinary-core-ideas.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/ngss-disciplinary-core-ideas').all(standardPolicy.isAllowed)
    .get(standards.list)
    .post(standards.create);

  // Single standard routes
  app.route('/api/ngss-disciplinary-core-ideas/:standardId').all(standardPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the standard middleware
  app.param('standardId', standards.standardByID);
};
