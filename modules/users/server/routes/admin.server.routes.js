'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  teams = require('../../../teams/server/controllers/teams.server.controller'),
  schoolOrgs = require('../../../school-orgs/server/controllers/school-orgs.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Team Lead approve
  app.route('/api/users/:userId/approve')
    .post(adminPolicy.isAllowed, admin.approve);

  // Team Lead deny
  app.route('/api/users/:userId/deny')
    .post(adminPolicy.isAllowed, admin.deny);

  app.route('/api/users/username')
    .get(adminPolicy.isAllowed, admin.userByUsername);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);


  // Setting up the invites
  app.route('/api/users/leaders')
    .post(adminPolicy.isAllowed, admin.createUser);
  app.route('/api/users/leaders/:userId/remind')
    .post(adminPolicy.isAllowed, admin.remindInvitee);

  app.route('/api/users/leaders/:userId')
    .put(adminPolicy.isAllowed, admin.updateUser);

  app.route('/api/users/leaders/:userId/organization/:orgId')
    .delete(adminPolicy.isAllowed, admin.deleteOrgLead);

  app.route('/api/users/leaders/:userId/team/:teamId')
    .delete(adminPolicy.isAllowed, admin.deleteTeamLead);

  // csv collection routes
  app.route('/api/users/leaders/csv')
    .get(adminPolicy.isAllowed, admin.downloadMemberBulkFile)
    .post(adminPolicy.isAllowed, admin.createMemberCsv);

  app.route('/api/users/leaders/validate/csv')
    .post(adminPolicy.isAllowed, admin.validateMemberCsv);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
  app.param('orgId', schoolOrgs.schoolOrgByID);
  app.param('teamId', teams.teamByID);
};
