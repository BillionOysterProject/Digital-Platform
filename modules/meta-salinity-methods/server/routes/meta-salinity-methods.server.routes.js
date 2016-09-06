'use strict';

/**
 * Module dependencies
 */
var salinityMethodsPolicy = require('../policies/meta-salinity-methods.server.policy'),
  salinityMethods = require('../controllers/meta-salinity-methods.server.controller');

module.exports = function(app) {
  // Meta salinity methods Routes
  app.route('/api/salinity-methods').all(salinityMethodsPolicy.isAllowed)
    .get(salinityMethods.list)
    .post(salinityMethods.create);

  app.route('/api/salinity-methods/:salinityMethodId').all(salinityMethodsPolicy.isAllowed)
    .get(salinityMethods.read)
    .put(salinityMethods.update)
    .delete(salinityMethods.delete);

  // Finish by binding the Meta salinity method middleware
  app.param('salinityMethodId', salinityMethods.salinityMethodByID);
};
