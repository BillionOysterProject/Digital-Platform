'use strict';

/**
 * Module dependencies
 */
var turbidityUnitsPolicy = require('../policies/meta-turbidity-units.server.policy'),
  turbidityUnits = require('../controllers/meta-turbidity-units.server.controller');

module.exports = function(app) {
  // Meta turbidity units Routes
  app.route('/api/turbidity-units').all(turbidityUnitsPolicy.isAllowed)
    .get(turbidityUnits.list)
    .post(turbidityUnits.create);

  app.route('/api/turbidity-units/:turbidityUnitId').all(turbidityUnitsPolicy.isAllowed)
    .get(turbidityUnits.read)
    .put(turbidityUnits.update)
    .delete(turbidityUnits.delete);

  // Finish by binding the Meta turbidity unit middleware
  app.param('turbidityUnitId', turbidityUnits.turbidityUnitByID);
};
