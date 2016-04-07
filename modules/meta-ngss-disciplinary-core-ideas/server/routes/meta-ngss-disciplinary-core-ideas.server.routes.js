'use strict';

/**
 * Module dependencies
 */
var metaNgssDciPolicy = require('../policies/meta-ngss-disciplinary-core-ideas.server.policy'),
  metaNgssDcis = require('../controllers/meta-ngss-disciplinary-core-ideas.server.controller');

module.exports = function (app) {
  // Standard collection routes
  app.route('/api/ngss-disciplinary-core-ideas').all(metaNgssDciPolicy.isAllowed)
    .get(metaNgssDcis.list)
    .post(metaNgssDcis.create);

  // Single standard routes
  app.route('/api/ngss-disciplinary-core-ideas/:metaNgssDciId').all(metaNgssDciPolicy.isAllowed)
    .get(metaNgssDcis.read)
    .put(metaNgssDcis.update)
    .delete(metaNgssDcis.delete);

  // Finish by binding the standard middleware
  app.param('metaNgssDciId', metaNgssDcis.standardByID);
};
