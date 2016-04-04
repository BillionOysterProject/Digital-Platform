'use strict';

/**
 * Module dependencies
 */
var standardPolicy = require('../policies/meta-ngss-science-engineering-practices.server.policy'),
  standards = require('../controllers/meta-ngss-science-engineering-practices.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/ngss-science-engineering-practices').all(standardPolicy.isAllowed)
    .get(standards.list)
    .post(standards.create);

  // Single standard routes
  app.route('/api/ngss-science-engineering-practices/:standardId').all(standardPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the standard middleware
  app.param('standardId', standards.standardByID);
};
