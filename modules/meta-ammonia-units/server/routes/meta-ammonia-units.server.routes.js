'use strict';

/**
 * Module dependencies
 */
var ammoniaUnitsPolicy = require('../policies/meta-ammonia-units.server.policy'),
  ammoniaUnits = require('../controllers/meta-ammonia-units.server.controller');

module.exports = function(app) {
  // Meta ammonia units Routes
  app.route('/api/ammonia-units').all(ammoniaUnitsPolicy.isAllowed)
    .get(ammoniaUnits.list)
    .post(ammoniaUnits.create);

  app.route('/api/ammonia-units/:ammoniaUnitId').all(ammoniaUnitsPolicy.isAllowed)
    .get(ammoniaUnits.read)
    .put(ammoniaUnits.update)
    .delete(ammoniaUnits.delete);

  // Finish by binding the Meta ammonia unit middleware
  app.param('ammoniaUnitId', ammoniaUnits.ammoniaUnitByID);
};
