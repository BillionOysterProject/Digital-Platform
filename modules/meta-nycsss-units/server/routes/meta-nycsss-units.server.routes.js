'use strict';

/**
 * Module dependencies
 */
var metaNycssUnitsPolicy = require('../policies/meta-nycsss-units.server.policy'),
  metaNycssUnits = require('../controllers/meta-nycsss-units.server.controller');

module.exports = function (app) {
  // Single standard routes
  app.route('/api/nycsss-units/:metaNycssUnitId').all(metaNycssUnitsPolicy.isAllowed)
    .get(metaNycssUnits.read)
    .put(metaNycssUnits.update)
    .delete(metaNycssUnits.delete);

  // Standard collection routes
  app.route('/api/nycsss-units').all(metaNycssUnitsPolicy.isAllowed)
    .get(metaNycssUnits.list)
    .post(metaNycssUnits.create);

  // Finish by binding the standard middleware
  app.param('metaNycssUnitId', metaNycssUnits.standardByID);
};
