'use strict';

/** 
* Module dependencies
*/
var waterQualitiesPolicy = require('../policies/protocol-water-quality.server.policy'),
  waterQualities = require('../controllers/protocol-water-quality.server.controller');

module.exports = function (app) {
  // Protocol Water Quality collection routes
  app.route('/api/protocol-water-quality').all(waterQualitiesPolicy.isAllowed)
    // .get(waterQualities.list)
    .post(waterQualities.create);

  // Single Protocol Water Quality routes
  app.route('/api/protocol-water-quality/:waterQualityId').all(waterQualitiesPolicy.isAllowed)
    .get(waterQualities.read)
    .put(waterQualities.update)
    .delete(waterQualities.delete);

  // Finish by binding the protocol water quality midleware
  app.param('waterQualityId', waterQualities.waterQualityByID);
};