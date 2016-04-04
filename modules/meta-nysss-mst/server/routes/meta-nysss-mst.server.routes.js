'use strict';

/**
 * Module dependencies
 */
var standardPolicy = require('../policies/meta-nysss-mst.server.policy'),
  standards = require('../controllers/meta-nysss-mst.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/nysss-mst').all(standardPolicy.isAllowed)
    .get(standards.list)
    .post(standards.create);

  // Single standard routes
  app.route('/api/nysss-mst/:standardId').all(standardPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the standard middleware
  app.param('standardId', standards.standardByID);
};
