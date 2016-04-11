'use strict';

/**
 * Module dependencies
 */
var metaNgssCccPolicy = require('../policies/meta-ngss-cross-cutting-concepts.server.policy'),
  metaNgssCccs = require('../controllers/meta-ngss-cross-cutting-concepts.server.controller');

module.exports = function (app) {
  // Single standard routes
  app.route('/api/ngss-cross-cutting-concepts/:metaNgssCccId').all(metaNgssCccPolicy.isAllowed)
    .get(metaNgssCccs.read)
    .put(metaNgssCccs.update)
    .delete(metaNgssCccs.delete);

  // Standard collection routes
  app.route('/api/ngss-cross-cutting-concepts').all(metaNgssCccPolicy.isAllowed)
    .get(metaNgssCccs.list)
    .post(metaNgssCccs.create);

  // Finish by binding the standard middleware
  app.param('metaNgssCccId', metaNgssCccs.standardByID);
};
