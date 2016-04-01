'use strict';

/**
 * Module dependencies
 */
var standardPolicy = require('../policies/meta-nysss-major-understandings.server.policy'),
  standards = require('../controllers/meta-nysss-major-understandings.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/nysss-major-understandings').all(standardPolicy.isAllowed)
    .get(standards.list)
    .post(standards.create);

  // Single standard routes
  app.route('/api/nysss-major-understandings/:standardId').all(standardPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the standard middleware
  app.param('standardId', standards.standardByID);
};
