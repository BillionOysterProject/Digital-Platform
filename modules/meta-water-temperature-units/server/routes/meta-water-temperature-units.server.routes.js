'use strict';

/**
 * Module dependencies
 */
var waterTemperatureUnitsPolicy = require('../policies/meta-water-temperature-units.server.policy'),
  waterTemperatureUnits = require('../controllers/meta-water-temperature-units.server.controller');

module.exports = function(app) {
  // Meta water temperature units Routes
  app.route('/api/water-temperature-units').all(waterTemperatureUnitsPolicy.isAllowed)
    .get(waterTemperatureUnits.list)
    .post(waterTemperatureUnits.create);

  app.route('/api/water-temperature-units/:waterTemperatureUnitId').all(waterTemperatureUnitsPolicy.isAllowed)
    .get(waterTemperatureUnits.read)
    .put(waterTemperatureUnits.update)
    .delete(waterTemperatureUnits.delete);

  // Finish by binding the Meta water temperature unit middleware
  app.param('waterTemperatureUnitId', waterTemperatureUnits.waterTemperatureUnitByID);
};
