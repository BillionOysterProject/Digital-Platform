'use strict';

/**
 * Module dependencies
 */
var expeditionsPolicy = require('../policies/expeditions.server.policy'),
  expeditions = require('../controllers/expeditions.server.controller');

module.exports = function (app) {
  // Compare expedition routes
  app.route('/api/expeditions/compare').all(expeditionsPolicy.isAllowed)
    .post(expeditions.compare);

  // Export expedition routes
  app.route('/api/expeditions/export-compare').all(expeditionsPolicy.isAllowed)
    .post(expeditions.downloadCompareCsv);

  app.route('/api/expeditions/restoration-station').all(expeditionsPolicy.isAllowed)
    .get(expeditions.listByORS);

  // Expeditions collection routes
  app.route('/api/expeditions').all(expeditionsPolicy.isAllowed)
    .get(expeditions.list)
    .post(expeditions.create);

  // Submit Expedition
  app.route('/api/expeditions/:expeditionId/submit').all(expeditionsPolicy.isAllowed)
    .post(expeditions.submit);

  // Publish Expedition
  app.route('/api/expeditions/:expeditionId/publish').all(expeditionsPolicy.isAllowed)
    .post(expeditions.publish);

  // Return Expedition
  app.route('/api/expeditions/:expeditionId/return').all(expeditionsPolicy.isAllowed)
    .post(expeditions.return);

  // Unpublish Expedition
  app.route('/api/expeditions/:expeditionId/unpublish').all(expeditionsPolicy.isAllowed)
    .post(expeditions.unpublish);

  // Single expedition routes
  app.route('/api/expeditions/:expeditionId').all(expeditionsPolicy.isAllowed)
    .get(expeditions.read)
    .put(expeditions.update)
    .delete(expeditions.delete);

  // Finish by binding the expedition middleware
  app.param('expeditionId', expeditions.expeditionByID);
};
