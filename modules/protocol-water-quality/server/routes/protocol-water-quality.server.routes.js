'use strict';

/**
* Module dependencies
*/
var waterQualitiesPolicy = require('../policies/protocol-water-quality.server.policy'),
  waterQualities = require('../controllers/protocol-water-quality.server.controller');

module.exports = function (app) {

  app.route('/api/protocol-water-quality/:waterQualityId/validate').all(waterQualitiesPolicy.isAllowed)
    .post(waterQualities.validate);

  // Single Protocol Water Quality routes
  app.route('/api/protocol-water-quality/:waterQualityId').all(waterQualitiesPolicy.isAllowed)
    .get(waterQualities.read)
    .put(waterQualities.update);

  // Finish by binding the protocol water quality midleware
  app.param('waterQualityId', waterQualities.waterQualityByID);
};
