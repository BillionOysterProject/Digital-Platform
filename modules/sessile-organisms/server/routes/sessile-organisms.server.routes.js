'use strict';

/**
 * Module dependencies
 */
var sessileOrganismsPolicy = require('../policies/sessile-organisms.server.policy'),
  sessileOrganisms = require('../controllers/sessile-organisms.server.controller');

module.exports = function (app) {
  // Sessile Organisms collection routes
  app.route('/api/sessile-organisms').all(sessileOrganismsPolicy.isAllowed)
    .get(sessileOrganisms.list)
    .post(sessileOrganisms.create);

  // Upload image route
  app.route('/api/sessile-organisms/:sessileOrganismId/upload-images').all(sessileOrganismsPolicy.isAllowed)
    .post(sessileOrganisms.uploadImage);

  // Single sessile organism routes
  app.route('/api/sessile-organisms/:sessileOrganismId').all(sessileOrganismsPolicy.isAllowed)
    .get(sessileOrganisms.read)
    .put(sessileOrganisms.update)
    .delete(sessileOrganisms.delete);

  // Finish by binding the sessile organism middleware
  app.param('sessileOrganismId', sessileOrganisms.sessileOrganismByID);
};
