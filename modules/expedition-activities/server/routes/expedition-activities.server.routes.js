'use strict';

/**
 * Module dependencies
 */
var expeditionActivitiesPolicy = require('../policies/expedition-activities.server.policy'),
  expeditionActivities = require('../controllers/expedition-activities.server.controller');

module.exports = function (app) {
  // Expedition Activity collection routes
  app.route('/api/expedition-activities').all(expeditionActivitiesPolicy.isAllowed)
    .get(expeditionActivities.list)
    .post(expeditionActivities.create);

  // Single expedition activity routes
  app.route('/api/expedition-activities/:expeditionActivityId').all(expeditionActivitiesPolicy.isAllowed)
    .get(expeditionActivities.read);

  // Finish by binding the expedition activity middleware
  app.param('expeditionActivityId', expeditionActivities.expeditionActivityByID);
};
