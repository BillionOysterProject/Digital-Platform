'use strict';

/**
 * Module dependencies
 */
var bodiesOfWaterPolicy = require('../policies/meta-bodies-of-water.server.policy'),
  bodiesOfWater = require('../controllers/meta-bodies-of-water.server.controller');

module.exports = function(app) {
  // Meta bodies of waters Routes
  app.route('/api/bodies-of-water').all(bodiesOfWaterPolicy.isAllowed)
    .get(bodiesOfWater.list)
    .post(bodiesOfWater.create);

  app.route('/api/bodies-of-water/:bodyOfWaterId').all(bodiesOfWaterPolicy.isAllowed)
    .get(bodiesOfWater.read)
    .put(bodiesOfWater.update)
    .delete(bodiesOfWater.delete);

  // Finish by binding the Meta bodies of water middleware
  app.param('bodyOfWaterId', bodiesOfWater.bodyOfWaterByID);
};
