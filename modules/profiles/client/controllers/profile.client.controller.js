(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$http', '$timeout', 'lodash', 'Authentication',
    'ExpeditionViewHelper', 'TeamsService', 'SchoolOrganizationsService', 'ExpeditionsService', 'Admin',
    'TeamRequestsService'];

  function ProfileController($scope, $http, $timeout, lodash, Authentication,
    ExpeditionViewHelper, TeamsService, SchoolOrganizationsService, ExpeditionsService, Admin,
    TeamRequestsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = [];

    vm.user = {};
    vm.organization = {};
    vm.teams = [];
    vm.teamToOpen = {};
    vm.userToOpen = {};

    vm.checkRole = ExpeditionViewHelper.checkRole;
    vm.isTeamLead = vm.checkRole('team lead') || vm.checkRole('team lead pending');
    vm.isTeamMember = vm.checkRole('team member') || vm.checkRole('team member pending');
    vm.isAdmin = vm.checkRole('admin');

    vm.findCurrentUserAndOrganization = function(callback) {
      $http.get('/api/users/username', {
        params: { username: Authentication.user.username }
      })
      .success(function(data, status, headers, config) {
        vm.user = data;
        vm.findOrganization(function() {
          if (callback) callback();
        });
      })
      .error(function(data, status, headers, config) {

      });
    };
    vm.findCurrentUserAndOrganization();

    vm.findOrganization = function(callback) {
      SchoolOrganizationsService.get({
        schoolOrgId: vm.user.schoolOrg._id,
        full: true
      }, function(orgData) {
        vm.organization = orgData;
        vm.orgPhotoUrl = (vm.organization.photo && vm.organization.photo.path) ?
          vm.organization.photo.path : '';
        if (callback) callback();
      });
    };

    vm.findTeams = function(callback) {
      var byOwner, byMember;
      if (vm.isTeamLead) {
        byOwner = true;
      } else {
        byMember = true;
      }

      TeamsService.query({
        byOwner: byOwner,
        byMember: byMember,
      }, function(data) {
        vm.teams = data;
        var expeditionsForTeams = function(teams, index, addedCallback) {
          if (index < teams.length) {
            var team = teams[index];
            vm.findExpeditions(team._id, function(expeditions) {
              team.expeditions = expeditions;
              expeditionsForTeams(teams, index+1, addedCallback);
            });
          } else {
            addedCallback();
          }
        };

        expeditionsForTeams(vm.teams, 0, function() {
          if (callback) callback();
        });
      });
    };
    vm.findTeams();

    vm.findExpeditions = function(teamId, callback) {
      ExpeditionsService.query({
        team: teamId,
        published: true
      }, function(data) {
        if (callback) callback(data);
      });
    };

    vm.findTeamRequests = function() {
      TeamRequestsService.query({
        byOwner: true
      }, function(data) {
        vm.teamRequests = data;
      });
    };
    vm.findTeamRequests();

    vm.sendReminder = function(lead) {
      $http.post('api/users/leaders/' + lead._id + '/remind', {
        user: lead,
        organization: vm.team.schoolOrg,
        team: vm.team,
        teamOrOrg: 'team',
        role: 'team lead pending'
      })
      .success(function(data, status, headers, config) {
        lead.reminderSent = true;
      })
      .error(function(data, status, headers, config) {
        vm.error = data;
      });
    };

    vm.capitalizeFirstLetter = function(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      } else {
        return '';
      }
    };

    vm.openViewUserModal = function(user) {
      vm.userToOpen = (user) ? user : new Admin();
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(openNewModalName) {
      angular.element('#modal-profile-user').modal('hide');
    };

    vm.openUserProfileForm = function() {
      console.log('openUserProfileForm');
      angular.element('#modal-admin-team-lead-editadd').modal('show');
    };

    vm.closeUserProfileForm = function() {
      angular.element('#modal-admin-team-lead-editadd').modal('hide');
    };

    vm.openChangePicture = function() {

    };

    vm.closeChangePicture = function() {

    };

    vm.openChangePassword = function() {
      angular.element('#change-password-modal').modal('show');
    };

    vm.closeChangePassword = function(success) {
      angular.element('#change-password-modal').modal('hide');
      if (success) {
        $timeout(function() {
          angular.element('#modal-password-change-success').modal('hide');
        });
      }
    };

    vm.openApproveTeamMembers = function() {

    };

    vm.closeApproveTeamMembers = function() {

    };

    vm.openApproveTeamLeads = function() {

    };

    vm.closeApproveTeamLeads = function() {

    };

    // Organization modals

    vm.openInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('show');
    };

    vm.closeInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('hide');
    };

    vm.openDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('show');
    };

    vm.closeDeleteOrgLead = function(refresh) {
      angular.element('#modal-org-lead-remove').modal('hide');
      if (refresh) vm.findOrganization();
    };

    vm.openFormOrg = function() {
      angular.element('#modal-org-edit').modal('show');
    };

    vm.closeFormOrg = function() {
      angular.element('#modal-org-edit').modal('hide');
      vm.findOrganization();
    };

    vm.openDeleteForm = function() {
      angular.element('#modal-org-delete').modal('show');
    };

    vm.closeDeleteForm = function(redirect) {
      angular.element('#modal-org-delete').modal('hide');
      if (redirect) {
        $timeout(function() {
          vm.findOrganization();
        }, 500);
      }
    };

    // end Organization modals

    // Team modals

    vm.openTeamProfileForm = function(team) {
      vm.teamToOpen = (team) ? team : new TeamsService();
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamProfileForm = function(data) {
      angular.element('#modal-team-edit').modal('hide');
      if (data) vm.findTeams();
    };

    vm.openInviteTeamLead = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-team-lead-invite').modal('show');
    };

    vm.closeInviteTeamLead = function(refresh) {
      angular.element('#modal-team-lead-invite').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openFormTeamMember = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-team-member-editadd').modal('show');
    };

    vm.closeFormTeamMember = function(refresh) {
      angular.element('#modal-team-member-editadd').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openImportTeamMembers = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-import-team-members').modal('show');
    };

    vm.closeImportTeamMembers = function(refresh) {
      angular.element('#modal-import-team-members').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openDeleteTeamLead = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-team-lead-remove').modal('show');
    };

    vm.closeDeleteTeamLead = function(refresh) {
      angular.element('#modal-team-lead-remove').modal('hide');
      if (refresh) vm.findTeams();
    };

    vm.openDeleteTeam = function(team) {
      vm.teamToOpen = team;
      angular.element('#modal-team-delete').modal('show');
    };

    vm.closeDeleteTeam = function(refresh) {
      angular.element('#modal-team-delete').modal('hide');
      if (refresh) {
        $timeout(function() {
          vm.findTeams();
        }, 500);
      }
    };

    // end Team modals
  }
})();
