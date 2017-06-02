'use strict';

/**
 * Module dependencies
 */
var teamsPolicy = require('../policies/teams.server.policy'),
  teams = require('../controllers/teams.server.controller');

module.exports = function (app) {

  // Teams members collection routes
  app.route('/api/teams/members').all(teamsPolicy.isAllowed)
    .get(teams.listMembers);

  // Teams collection routes
  app.route('/api/teams').all(teamsPolicy.isAllowed)
    .get(teams.list)
    .post(teams.create);

  app.route('/api/teams/members/:memberId').all(teamsPolicy.isAllowed)
    .get(teams.readMember)
    .delete(teams.deleteMember);

  app.route('/api/teams/:teamId/upload-image').all(teamsPolicy.isAllowed)
    .post(teams.uploadTeamPhoto);

  // Single team routes
  app.route('/api/teams/:teamId').all(teamsPolicy.isAllowed)
    .get(teams.read)
    .put(teams.update)
    .delete(teams.delete);

  app.route('/api/teams/:teamId/members/:memberId').all(teamsPolicy.isAllowed)
    .delete(teams.deleteMember);

  // Finish by binding the team middleware
  app.param('teamId', teams.teamByID);
  app.param('memberId', teams.memberByID);
};
