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

  app.route('/api/teams/members/validate/csv').all(teamsPolicy.isAllowed)
    .post(teams.validateMemberCsv);

  // Teams members collection routes
  app.route('/api/teams/members').all(teamsPolicy.isAllowed)
    .get(teams.listMembers)
    .post(teams.createMember);

  app.route('/api/teams/members/:memberId').all(teamsPolicy.isAllowed)
    .get(teams.readMember)
    .put(teams.updateMember);

  app.route('/api/teams/members/:memberId/remind').all(teamsPolicy.isAllowed)
    .post(teams.remindMember);

  app.route('/api/teams/:teamId/members/:memberId').all(teamsPolicy.isAllowed)
    //.get(teams.listMembers)
    .delete(teams.deleteMember);

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
