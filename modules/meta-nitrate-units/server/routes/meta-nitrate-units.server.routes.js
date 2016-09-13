'use strict';

/**
 * Module dependencies
 */
var nitrateUnitsPolicy = require('../policies/meta-nitrate-units.server.policy'),
  nitrateUnits = require('../controllers/meta-nitrate-units.server.controller');

module.exports = function(app) {
  // Meta nitrate units Routes
  app.route('/api/nitrate-units').all(nitrateUnitsPolicy.isAllowed)
    .get(nitrateUnits.list)
    .post(nitrateUnits.create);

  app.route('/api/nitrate-units/:nitrateUnitId').all(nitrateUnitsPolicy.isAllowed)
    .get(nitrateUnits.read)
    .put(nitrateUnits.update)
    .delete(nitrateUnits.delete);

  // Finish by binding the Meta nitrate unit middleware
  app.param('nitrateUnitId', nitrateUnits.nitrateUnitByID);
};
