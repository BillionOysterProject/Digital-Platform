(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$http', '$timeout', 'Authentication',
    'ExpeditionViewHelper', 'TeamsService', 'Admin'];

  function ProfileController($scope, $http, $timeout, Authentication,
    ExpeditionViewHelper, TeamsService, Admin) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = [];

    vm.user = {};
    vm.organization = {};
    vm.teams = [];

    vm.checkRole = ExpeditionViewHelper.checkRole;
    vm.isTeamLead = vm.checkRole('team lead') || vm.checkRole('team lead pending');

    vm.findCurrentUserAndOrganization = function(callback) {
      $http.get('/api/users/username', {
        params: { username: Authentication.user.username }
      })
      .success(function(data, status, headers, config) {
        vm.user = data;
        vm.organization = data.schoolOrg;
        if (callback) callback();
      })
      .error(function(data, status, headers, config) {

      });
    };
    vm.findCurrentUserAndOrganization();

    vm.findTeams = function(callback) {
      var byOwner, byMember;
      if (vm.isTeamLead) {
        byOwner = true;
      } else {
        byMember = true;
      }

      TeamsService.query({
        byOwner: byOwner,
        byMember: byMember
      }, function(data) {
        vm.teams = data;
        if (callback) callback();
      });
    };
    vm.findTeams();

    vm.openTeamFormModal = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamFormModal = function() {
      angular.element('#modal-team-edit').modal('hide');
    };

    vm.openViewUserModal = function() {
      vm.findCurrentUserAndOrganization(function() {
        vm.findTeams(function() {
          angular.element('#modal-profile-user').modal('show');
        });
      });
    };

    vm.closeViewUserModal = function(openNewModalName) {
      // angular.element(openNewModalName).modal('show');
      angular.element('#modal-profile-user').modal('hide');
      if (openNewModalName) {
        $timeout(function() {
          angular.element(openNewModalName).modal('show');
        }, 1000);
      }
    };

    vm.openAdminTeamLeadForm = function() {
      console.log('openAdminTeamLeadForm');
      angular.element('#modal-admin-team-lead-editadd').modal('show');
    };

    vm.closeAdminTeamLeadForm = function() {
      angular.element('#modal-admin-team-lead-editadd').modal('hide');
    };

    vm.openFormTeamMember = function() {
      angular.element('#modal-team-member-editadd').modal('show');
    };

    vm.closeFormTeamMember = function() {
      angular.element('#modal-team-member-editadd').modal('hide');
    };

    // vm.openUserForm = function() {
    //   if (vm.isAdmin || vm.isTeamLead) {
    //     vm.openAdminTeamLeadForm();
    //   } else {
    //     vm.openFormTeamMember();
    //   }
    // };

    vm.openPasswordChanged = function() {
      angular.element('#change-password-modal').modal('show');
    };

    vm.passwordChanged = function(success) {
      angular.element('#change-password-modal').modal('hide');
      if (success) {
        $timeout(function() {
          angular.element('#modal-password-change-success').modal('hide');
        });
      }
    };

    vm.openInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('show');
    };

    vm.closeInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('hide');
    };

    vm.openDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('show');
    };

    vm.closeDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('hide');
    };

    vm.openTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('hide');
    };

    vm.openInviteTeamLead = function() {
      angular.element('#modal-team-lead-invite').modal('show');
    };

    vm.closeInviteTeamLead = function() {
      angular.element('#modal-team-lead-invite').modal('hide');
    };

    vm.openDeleteTeamLead = function() {
      angular.element('#modal-team-lead-remove').modal('show');
    };

    vm.closeDeleteTeamLead = function() {
      angular.element('#modal-team-lead-remove').modal('hide');
    };
  }
})();
