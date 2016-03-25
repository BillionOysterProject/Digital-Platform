'use strict';

/**
 * Module dependencies
 */
var mobileOrganismsPolicy = require('../policies/mobile-organisms.server.policy'),
  mobileOrganisms = require('../controllers/mobile-organisms.server.controller');

module.exports = function (app) {
  // Mobile Organisms collection routes
  app.route('/api/mobile-organisms').all(mobileOrganismsPolicy.isAllowed)
    .get(mobileOrganisms.list)
    .post(mobileOrganisms.create);

  // Upload image route
  app.route('/api/mobile-organisms/:mobileOrganismId/upload-images').all(mobileOrganismsPolicy.isAllowed)
    .post(mobileOrganisms.uploadImage);

  // Single mobile organism routes
  app.route('/api/mobile-organisms/:mobileOrganismId').all(mobileOrganismsPolicy.isAllowed)
    .get(mobileOrganisms.read)
    .put(mobileOrganisms.update)
    .delete(mobileOrganisms.delete);

  // Finish by binding the mobile organism middleware
  app.param('mobileOrganismId', mobileOrganisms.mobileOrganismByID);
};
