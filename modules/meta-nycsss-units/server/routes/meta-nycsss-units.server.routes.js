'use strict';

/**
 * Module dependencies
 */
var standardPolicy = require('../policies/meta-nycsss-units.server.policy'),
  standards = require('../controllers/meta-nycsss-units.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/nycsss-units').all(standardPolicy.isAllowed)
    .get(standards.list)
    .post(standards.create);

  // Single standard routes
  app.route('/api/nycsss-units/:standardId').all(standardPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the standard middleware
  app.param('standardId', standards.standardByID);
};
