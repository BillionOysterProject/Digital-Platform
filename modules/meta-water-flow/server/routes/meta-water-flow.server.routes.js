'use strict';

/**
 * Module dependencies
 */
var waterFlowsPolicy = require('../policies/meta-water-flow.server.policy'),
  waterFlows = require('../controllers/meta-water-flow.server.controller');

module.exports = function (app) {
  // Water Flow collection routes
  app.route('/api/water-flows').all(waterFlowsPolicy.isAllowed)
    .get(waterFlows.list)
    .post(waterFlows.create);

  // Single water flow routes
  app.route('/api/water-flows/:waterFlowId').all(waterFlowsPolicy.isAllowed)
    .get(waterFlows.read)
    .put(waterFlows.update)
    .delete(waterFlows.delete);

  // Finish by binding the water flow middleware
  app.param('waterFlowId', waterFlows.waterFlowByID);
};
