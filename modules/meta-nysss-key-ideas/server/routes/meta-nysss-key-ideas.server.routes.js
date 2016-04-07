'use strict';

/**
 * Module dependencies
 */
var metaNysssKiPolicy = require('../policies/meta-nysss-key-ideas.server.policy'),
  metaNysssKis = require('../controllers/meta-nysss-key-ideas.server.controller');

module.exports = function (app) {
  // Single standard routes
  app.route('/api/nysss-key-ideas/:metaNysssKiId').all(metaNysssKiPolicy.isAllowed)
    .get(metaNysssKis.read)
    .put(metaNysssKis.update)
    .delete(metaNysssKis.delete);

  // Standard collection routes
  app.route('/api/nysss-key-ideas').all(metaNysssKiPolicy.isAllowed)
    .get(metaNysssKis.list)
    .post(metaNysssKis.create);

  // Finish by binding the standard middleware
  app.param('metaNysssKiId', metaNysssKis.standardByID);
};
