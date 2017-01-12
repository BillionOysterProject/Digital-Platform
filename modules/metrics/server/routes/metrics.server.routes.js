'use strict';

/**
 * Module dependencies
 */
var metricsPolicy = require('../policies/metrics.server.policy'),
  metrics = require('../controllers/metrics.server.controller');

module.exports = function(app) {
  // Metrics Routes
  app.route('/api/metrics/download').all(metricsPolicy.isAllowed)
    .get(metrics.downloadZip);

  app.route('/api/metrics/people').all(metricsPolicy.isAllowed)
    .get(metrics.getPeopleMetrics);

  app.route('/api/metrics/activeUsers').all(metricsPolicy.isAllowed)
    .get(metrics.getMostActiveUsers);

  app.route('/api/metrics/curriculum').all(metricsPolicy.isAllowed)
    .get(metrics.getCurriculumMetrics);

  app.route('/api/metrics/curriculum/units/monthlyTotals').all(metricsPolicy.isAllowed)
    .get(metrics.getMonthlyUnitCounts);

  app.route('/api/metrics/curriculum/lessons/monthlyTotals').all(metricsPolicy.isAllowed)
    .get(metrics.getMonthlyLessonCounts);

  app.route('/api/metrics/stations').all(metricsPolicy.isAllowed)
    .get(metrics.getStationMetrics);

  app.route('/api/metrics/stations/monthlyTotals').all(metricsPolicy.isAllowed)
    .get(metrics.getMonthlyStationCounts);

  app.route('/api/metrics/expeditions/monthlyTotals').all(metricsPolicy.isAllowed)
    .get(metrics.getMonthlyExpeditionCounts);

  app.route('/api/metrics/events').all(metricsPolicy.isAllowed)
    .get(metrics.getEventMetrics);

  app.route('/api/metrics/events/monthlyTotals').all(metricsPolicy.isAllowed)
    .get(metrics.getMonthlyEventCounts);

  app.route('/api/metrics/events/statistics').all(metricsPolicy.isAllowed)
    .get(metrics.getEventActivity);
};
