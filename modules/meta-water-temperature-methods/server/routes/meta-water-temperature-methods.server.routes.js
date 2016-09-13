'use strict';

/**
 * Module dependencies
 */
var waterTemperatureMethodsPolicy = require('../policies/meta-water-temperature-methods.server.policy'),
  waterTemperatureMethods = require('../controllers/meta-water-temperature-methods.server.controller');

module.exports = function(app) {
  // Meta water temperature methods Routes
  app.route('/api/water-temperature-methods').all(waterTemperatureMethodsPolicy.isAllowed)
    .get(waterTemperatureMethods.list)
    .post(waterTemperatureMethods.create);

  app.route('/api/water-temperature-methods/:waterTemperatureMethodId').all(waterTemperatureMethodsPolicy.isAllowed)
    .get(waterTemperatureMethods.read)
    .put(waterTemperatureMethods.update)
    .delete(waterTemperatureMethods.delete);

  // Finish by binding the Meta water temperature method middleware
  app.param('waterTemperatureMethodId', waterTemperatureMethods.waterTemperatureMethodByID);
};
