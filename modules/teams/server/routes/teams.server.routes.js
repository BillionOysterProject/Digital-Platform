'use strict';

/**
 * Module dependencies
 */
var teamsPolicy = require('../policies/teams.server.policy'),
  teams = require('../controllers/teams.server.controller');

module.exports = function (app) {
  // Teams members csv collection routes
  app.route('/api/teams/members/csv').all(teamsPolicy.isAllowed)
    .get(teams.downloadMemberBulkFile)
    .post(teams.createMemberCsv);

  // Teams members collection routes
  app.route('/api/teams/members').all(teamsPolicy.isAllowed)
    .get(teams.listMembers)
    .post(teams.createMember);

  app.route('/api/teams/members/:memberId').all(teamsPolicy.isAllowed)
    .put(teams.updateMember);

  app.route('/api/teams/:teamId/members/:memberId').all(teamsPolicy.isAllowed)
    //.get(teams.listMembers)
    .delete(teams.deleteMember);

  app.route('/api/teams/user').all(teamsPolicy)
    .get(teams.teamForTeamMember);

  // Teams collection routes
  app.route('/api/teams').all(teamsPolicy.isAllowed)
    .get(teams.list)
    .post(teams.create);

  // Single team routes
  app.route('/api/teams/:teamId').all(teamsPolicy.isAllowed)
    .get(teams.read)
    .put(teams.update)
    .delete(teams.delete);

  // Finish by binding the team middleware
  app.param('teamId', teams.teamByID);
  app.param('memberId', teams.memberByID);
};
