'use strict';

/**
 * Module dependencies
 */
var weatherConditionsPolicy = require('../policies/meta-weather-conditions.server.policy'),
  weatherConditions = require('../controllers/meta-weather-conditions.server.controller');

module.exports = function (app) {
  // Weather Conditions collection routes
  app.route('/api/weather-conditions').all(weatherConditionsPolicy.isAllowed)
    .get(weatherConditions.list)
    .post(weatherConditions.create);

  // Single weather conditions routes
  app.route('/api/weather-conditions/:weatherConditionId').all(weatherConditionsPolicy.isAllowed)
    .get(weatherConditions.read)
    .put(weatherConditions.update)
    .delete(weatherConditions.delete);

  // Finish by binding the weather conditions middleware
  app.param('weatherConditionId', weatherConditions.weatherConditionByID);
};
