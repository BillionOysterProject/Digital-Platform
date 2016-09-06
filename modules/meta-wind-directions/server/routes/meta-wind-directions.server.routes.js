'use strict';

/**
 * Module dependencies
 */
var windDirectionsPolicy = require('../policies/meta-wind-directions.server.policy'),
  windDirections = require('../controllers/meta-wind-directions.server.controller');

module.exports = function(app) {
  // Meta wind directions Routes
  app.route('/api/wind-directions').all(windDirectionsPolicy.isAllowed)
    .get(windDirections.list)
    .post(windDirections.create);

  app.route('/api/wind-directions/:windDirectionId').all(windDirectionsPolicy.isAllowed)
    .get(windDirections.read)
    .put(windDirections.update)
    .delete(windDirections.delete);

  // Finish by binding the Meta wind direction middleware
  app.param('windDirectionId', windDirections.windDirectionByID);
};
