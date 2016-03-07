'use strict';

/**
 * Module dependencies
 */
var shorelineTypePolicy = require('../policies/meta-shoreline-types.server.policy'),
  shorelineTypes = require('../controllers/meta-shoreline-types.server.controller');

module.exports = function (app) {
  // Shoreline types collection routes
  app.route('/api/shoreline-types').all(shorelineTypePolicy.isAllowed)
    .get(shorelineTypes.list)
    .post(shorelineTypes.create);

  // Single shoreline type routes
  app.route('/api/shoreline-types/:shorelineTypeId').all(shorelineTypePolicy.isAllowed)
    .get(shorelineTypes.read)
    .put(shorelineTypes.update)
    .delete(shorelineTypes.delete);

  // Finish by binding the shoreline type middleware
  app.param('shorelineTypeId', shorelineTypes.shorelineTypeByID);
};
