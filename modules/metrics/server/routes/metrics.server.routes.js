'use strict';

/**
 * Module dependencies
 */
var metricsPolicy = require('../policies/metrics.server.policy'),
  metrics = require('../controllers/metrics.server.controller');

module.exports = function(app) {
  // Metrics Routes
  app.route('/api/metrics/people').all(metricsPolicy.isAllowed)
    .get(metrics.getPeopleMetrics);
};
