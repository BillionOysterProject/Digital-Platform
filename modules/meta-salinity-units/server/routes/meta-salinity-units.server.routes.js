'use strict';

/**
 * Module dependencies
 */
var salinityUnitsPolicy = require('../policies/meta-salinity-units.server.policy'),
  salinityUnits = require('../controllers/meta-salinity-units.server.controller');

module.exports = function(app) {
  // Meta salinity units Routes
  app.route('/api/salinity-units').all(salinityUnitsPolicy.isAllowed)
    .get(salinityUnits.list)
    .post(salinityUnits.create);

  app.route('/api/salinity-units/:salinityUnitId').all(salinityUnitsPolicy.isAllowed)
    .get(salinityUnits.read)
    .put(salinityUnits.update)
    .delete(salinityUnits.delete);

  // Finish by binding the Meta salinity unit middleware
  app.param('salinityUnitId', salinityUnits.salinityUnitByID);
};
