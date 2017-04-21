'use strict';

/**
 * Module dependencies
 */
var schoolOrgsPolicy = require('../policies/school-orgs.server.policy'),
  schoolOrgs = require('../controllers/school-orgs.server.controller');

module.exports = function (app) {
  // Teams by School/Organization routes
  app.route('/api/school-orgs/:schoolOrgId/teams').all(schoolOrgsPolicy.isAllowed)
    .get(schoolOrgs.teamsBySchoolOrgs);

  // Team Leads by School/Organization routes
  app.route('/api/school-orgs/:schoolOrgId/team-leads').all(schoolOrgsPolicy.isAllowed)
    .get(schoolOrgs.teamLeadsBySchoolOrg);

  // Teams by School/Organization and Team Lead routes
  app.route('/api/school-orgs/:schoolOrgId/team-leads/:teamLeadId').all(schoolOrgsPolicy.isAllowed)
    .get(schoolOrgs.teamsBySchoolOrgsAndTeamLeads);

  // School/Organization collection routes
  app.route('/api/school-orgs').all(schoolOrgsPolicy.isAllowed)
    .get(schoolOrgs.list)
    .post(schoolOrgs.create);

  app.route('/api/school-orgs/:schoolOrgId/approve').all(schoolOrgsPolicy.isAllowed)
    .post(schoolOrgs.approve);

  app.route('/api/school-orgs/:schoolOrgId/deny').all(schoolOrgsPolicy.isAllowed)
    .post(schoolOrgs.deny);

  app.route('/api/school-orgs/:schoolOrgId/upload-image').all(schoolOrgsPolicy.isAllowed)
    .post(schoolOrgs.uploadOrgPhoto);

  app.route('/api/school-orgs/:schoolOrgId').all(schoolOrgsPolicy.isAllowed)
    .get(schoolOrgs.read)
    .put(schoolOrgs.update)
    .delete(schoolOrgs.delete);

  // Finish by binding the school/organization middleware
  app.param('schoolOrgId', schoolOrgs.schoolOrgByID);
  app.param('teamLeadId', schoolOrgs.teamLeadByID);
};
