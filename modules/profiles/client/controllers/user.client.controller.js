(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = ['$scope', '$http', '$timeout', 'lodash', 'ExpeditionViewHelper',
    'TeamsService', 'SchoolOrganizationsService', 'TeamMembersService', 'Admin', 'ExpeditionsService'];

  function UserProfileController($scope, $http, $timeout, lodash, ExpeditionViewHelper,
    TeamsService, SchoolOrganizationsService, TeamMembersService, Admin, ExpeditionsService) {
    $scope.checkRole = ExpeditionViewHelper.checkRole;

    $scope.findUserRoles = function() {
      var roles = $scope.user.roles;
      lodash.remove(roles, function(n) {
        return n === 'user';
      });
      return roles.join(', ');
    };

    $scope.checkUserPending = function() {
      var teamLeadIndex = lodash.findIndex($scope.user.roles, function(o) {
        return o === ('team lead pending' || 'team member pending');
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    $scope.sendReminder = function(teamName) {
      $scope.reminderSent = true;

      $http.post('/api/teams/members/' + $scope.user._id + '/remind', {
        team: {
          name: teamName
        }
      }).
      success(function(data, status, headers, config) {
        $timeout(function() {
          $scope.reminderSent = false;
        }, 15000);
      }).
      error(function(data, status, headers, config) {
        $scope.error = data.res.message;
        $timeout(function() {
          $scope.reminderSent = false;
        }, 15000);
      });
    };

    $scope.allTeams = TeamsService.query();
    $scope.allOrganizations = SchoolOrganizationsService.query();

    $scope.findExpeditions = function() {
      var byOwner, byMember;
      if ($scope.isTeamLead) {
        byOwner = true;
      } else {
        byMember = true;
      }

      ExpeditionsService.query({
        byOwner: byOwner,
        byMember: byMember,
      }, function(data) {
        console.log('expeditions', data);
        $scope.expeditions = data;
      });
    };

    $scope.openAdminTeamLeadForm = function() {
      $scope.closeFunction('#modal-admin-team-lead-editadd');
    };

    $scope.closeAdminTeamLeadForm = function() {
      $scope.formUser = {};
      angular.element('#modal-admin-team-lead-editadd').modal('hide');
    };

    $scope.openDeleteAdminTeamLead = function() {
      $scope.userToDelete = ($scope.user) ? new Admin($scope.user) : new Admin();
      angular.element('#modal-delete-admin-team-lead').modal('show');
    };

    $scope.closeDeleteAdminTeamLead = function() {
      $scope.userToDelete = {};
      angular.element('#modal-delete-admin-team-lead').modal('hide');
    };

    $scope.openFormTeamMember = function() {
      $scope.teamMember = ($scope.user) ? new TeamMembersService($scope.user) : new TeamMembersService();
      $scope.teamMember.oldTeamId = ($scope.user && $scope.user.team) ? angular.copy($scope.user.team._id) : '';

      angular.element('#modal-team-member-editadd').modal('show');
    };

    $scope.closeFormTeamMember = function() {
      $scope.teamMember = {};
      angular.element('#modal-team-member-editadd').modal('hide');
    };

    $scope.openDeleteTeamMember = function(teamMember) {
      $scope.teamMember = ($scope.user) ? new TeamMembersService($scope.user) : new TeamMembersService();
      angular.element('#modal-team-member-delete').modal('show');
    };

    $scope.closeDeleteTeamMember = function() {
      $scope.teamMember = {};
      angular.element('#modal-team-member-delete').modal('hide');
    };

    $scope.openUserForm = function() {
      if ($scope.isAdmin) {
        $scope.openAdminTeamLeadForm();
      } else {
        $scope.openFormTeamMember();
      }
    };

    $scope.openUserDelete = function() {
      if ($scope.isAdmin) {
        $scope.openDeleteAdminTeamLead();
      } else {
        $scope.openDeleteTeamMember();
      }
    };
  }
})();
