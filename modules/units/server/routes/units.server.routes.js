'use strict';

/**
 * Module dependencies
 */
var unitsPolicy = require('../policies/units.server.policy'),
  units = require('../controllers/units.server.controller');

module.exports = function (app) {
  // Units collection routes
  app.route('/api/units').all(unitsPolicy.isAllowed)
    .get(units.list)
    .post(units.create);

  // Single unit routes
  app.route('/api/units/:unitId').all(unitsPolicy.isAllowed)
    .get(units.read)
    .put(units.update)
    .delete(units.delete);

  // Finish by binding the unit middleware
  app.param('unitId', units.unitByID);
};
