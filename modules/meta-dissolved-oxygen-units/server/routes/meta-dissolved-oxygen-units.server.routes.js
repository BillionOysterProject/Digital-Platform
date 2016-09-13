'use strict';

/**
 * Module dependencies
 */
var dissolvedOxygenUnitsPolicy = require('../policies/meta-dissolved-oxygen-units.server.policy'),
  dissolvedOxygenUnits = require('../controllers/meta-dissolved-oxygen-units.server.controller');

module.exports = function(app) {
  // Meta dissolved oxygen units Routes
  app.route('/api/dissolved-oxygen-units').all(dissolvedOxygenUnitsPolicy.isAllowed)
    .get(dissolvedOxygenUnits.list)
    .post(dissolvedOxygenUnits.create);

  app.route('/api/dissolved-oxygen-units/:dissolvedOxygenUnitId').all(dissolvedOxygenUnitsPolicy.isAllowed)
    .get(dissolvedOxygenUnits.read)
    .put(dissolvedOxygenUnits.update)
    .delete(dissolvedOxygenUnits.delete);

  // Finish by binding the Meta dissolved oxygen unit middleware
  app.param('dissolvedOxygenUnitId', dissolvedOxygenUnits.dissolvedOxygenUnitByID);
};
