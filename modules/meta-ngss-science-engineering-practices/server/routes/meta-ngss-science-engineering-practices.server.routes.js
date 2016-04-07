'use strict';

/**
 * Module dependencies
 */
var metaNgssSepPolicy = require('../policies/meta-ngss-science-engineering-practices.server.policy'),
  metaNgssSeps = require('../controllers/meta-ngss-science-engineering-practices.server.controller');

module.exports = function (app) {
  // Single standard routes
  app.route('/api/ngss-science-engineering-practices/:metaNgssSepId').all(metaNgssSepPolicy.isAllowed)
    .get(metaNgssSeps.read)
    .put(metaNgssSeps.update)
    .delete(metaNgssSeps.delete);

  // Standard collection routes
  app.route('/api/ngss-science-engineering-practices').all(metaNgssSepPolicy.isAllowed)
    .get(metaNgssSeps.list)
    .post(metaNgssSeps.create);

  // Finish by binding the standard middleware
  app.param('metaNgssSepId', metaNgssSeps.standardByID);
};
