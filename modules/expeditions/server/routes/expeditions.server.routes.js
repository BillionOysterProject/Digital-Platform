'use strict';

/**
 * Module dependencies
 */
var expeditionsPolicy = require('../policies/expeditions.server.policy'),
  expeditions = require('../controllers/expeditions.server.controller');

module.exports = function (app) {
  // Expeditions collection routes
  app.route('/api/expeditions').all(expeditionsPolicy.isAllowed)
    .get(expeditions.list)
    .post(expeditions.create);

  // Single expedition routes
  app.route('/api/expeditions/:expeditionId').all(expeditionsPolicy.isAllowed)
    .get(expeditions.read)
    .put(expeditions.update)
    .delete(expeditions.delete);

  // Finish by binding the expedition middleware
  app.param('expeditionId', expeditions.expeditionByID);
};
