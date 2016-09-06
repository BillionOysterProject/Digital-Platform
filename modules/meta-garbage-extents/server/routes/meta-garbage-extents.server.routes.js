'use strict';

/**
 * Module dependencies
 */
var garbageExtentsPolicy = require('../policies/meta-garbage-extents.server.policy'),
  garbageExtents = require('../controllers/meta-garbage-extents.server.controller');

module.exports = function(app) {
  // Meta garbage extents Routes
  app.route('/api/garbage-extents').all(garbageExtentsPolicy.isAllowed)
    .get(garbageExtents.list)
    .post(garbageExtents.create);

  app.route('/api/garbage-extents/:garbageExtentId').all(garbageExtentsPolicy.isAllowed)
    .get(garbageExtents.read)
    .put(garbageExtents.update)
    .delete(garbageExtents.delete);

  // Finish by binding the Meta garbage extent middleware
  app.param('garbageExtentId', garbageExtents.garbageExtentByID);
};
