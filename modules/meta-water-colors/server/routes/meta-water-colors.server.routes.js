'use strict';

/**
 * Module dependencies
 */
var waterColorPolicy = require('../policies/meta-water-colors.server.policy'),
  waterColors = require('../controllers/meta-water-colors.server.controller');

module.exports = function (app) {
  // Water Colors collection routes
  app.route('/api/water-colors').all(waterColorPolicy.isAllowed)
    .get(waterColors.list)
    .post(waterColors.create);

  // Single water color routes
  app.route('/api/water-colors/:waterColorId').all(waterColorPolicy.isAllowed)
    .get(waterColors.read)
    .put(waterColors.update)
    .delete(waterColors.delete);

  // Finish by binding the water color middleware
  app.param('waterColorId', waterColors.waterColorByID);
};
