'use strict';

/**
 * Module dependencies
 */
var subjectAreasPolicy = require('../policies/meta-subject-areas.server.policy'),
  subjectAreas = require('../controllers/meta-subject-areas.server.controller');

module.exports = function (app) {
  // Subject Area collection routes
  app.route('/api/subject-areas').all(subjectAreasPolicy.isAllowed)
    .get(subjectAreas.list)
    .post(subjectAreas.create);

  // Single subject area routes
  app.route('/api/subject-areas/:subjectAreaId').all(subjectAreasPolicy.isAllowed)
    .get(subjectAreas.read)
    .put(subjectAreas.update)
    .delete(subjectAreas.delete);

  // Finish by binding the subject area middleware
  app.param('subjectAreaId', subjectAreas.subjectAreaByID);
};
