'use strict';

/**
 * Module dependencies
 */
var bioaccumulationsPolicy = require('../policies/meta-bioaccumulation.server.policy'),
  bioaccumulations = require('../controllers/meta-bioaccumulation.server.controller');

module.exports = function (app) {
  // Bioaccumulation collection routes
  app.route('/api/bioaccumulations').all(bioaccumulationsPolicy.isAllowed)
    .get(bioaccumulations.list)
    .post(bioaccumulations.create);

  // Single bioaccumulation routes
  app.route('/api/bioaccumulations/:bioaccumulationId').all(bioaccumulationsPolicy.isAllowed)
    .get(bioaccumulations.read)
    .put(bioaccumulations.update)
    .delete(bioaccumulations.delete);

  // Finish by binding the bioaccumulation middleware
  app.param('bioaccumulationId', bioaccumulations.bioaccumulationByID);
};
