'use strict';

/**
 * Module dependencies
 */
var teamRequestsPolicy = require('../policies/team-requests.server.policy'),
  teamRequests = require('../controllers/team-requests.server.controller');

module.exports = function (app) {
  // Team requests collection routes
  app.route('/api/team-requests').all(teamRequestsPolicy.isAllowed)
    .get(teamRequests.list)
    .post(teamRequests.create);

  // Team requests approve routes
  app.route('/api/team-requests/:teamRequestId/approve').all(teamRequestsPolicy.isAllowed)
    .post(teamRequests.approve);

  // Team requests deny routes
  app.route('/api/team-requests/:teamRequestId/deny').all(teamRequestsPolicy.isAllowed)
    .post(teamRequests.deny);

  // Single team requests
  app.route('/api/team-requests/:teamRequestId').all(teamRequestsPolicy.isAllowed)
    .get(teamRequests.read)
    .put(teamRequests.update)
    .delete(teamRequests.delete);

  // Finish by binding the team request middleware
  app.param('teamRequestId', teamRequests.teamRequestByID);
};
