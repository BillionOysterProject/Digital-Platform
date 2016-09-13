'use strict';

/**
 * Module dependencies
 */
var phUnitsPolicy = require('../policies/meta-ph-units.server.policy'),
  phUnits = require('../controllers/meta-ph-units.server.controller');

module.exports = function(app) {
  // Meta ph units Routes
  app.route('/api/ph-units').all(phUnitsPolicy.isAllowed)
    .get(phUnits.list)
    .post(phUnits.create);

  app.route('/api/ph-units/:phUnitId').all(phUnitsPolicy.isAllowed)
    .get(phUnits.read)
    .put(phUnits.update)
    .delete(phUnits.delete);

  // Finish by binding the Meta ph unit middleware
  app.param('phUnitId', phUnits.phUnitByID);
};
