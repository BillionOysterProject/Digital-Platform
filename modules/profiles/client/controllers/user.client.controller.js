(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = ['$scope', '$http', '$timeout', 'lodash', 'ExpeditionViewHelper',
    'TeamMembersService', 'TeamsService', 'Admin', 'ExpeditionsService', 'SchoolOrganizationsService'];

  function UserProfileController($scope, $http, $timeout, lodash, ExpeditionViewHelper,
    TeamMembersService, TeamsService, Admin, ExpeditionsService, SchoolOrganizationsService) {
    $scope.checkRole = ExpeditionViewHelper.checkRole;

    $scope.findOrganization = function() {
      if (!$scope.organization) {
        if ($scope.user.schoolOrg) {
          if ($scope.user.schoolOrg._id) {
            $scope.organization = $scope.user.schoolOrg;
          } else {
            SchoolOrganizationsService.get({
              schoolOrgId: $scope.user.schoolOrg
            }, function(data) {
              $scope.organization = data;
            });
          }
        }
      }
    };

    $scope.findTeams = function(isTeamLead) {
      if (!$scope.teams || $scope.teams.length === 0) {
        var byOwner, byMember;
        if ($scope.isTeamLead) {
          byOwner = true;
        } else {
          byMember = true;
        }

        TeamsService.query({
          byOwner: byOwner,
          byMember: byMember
        }, function(data) {
          $scope.teams = data;
        });
      }
    };

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

    $scope.checkViewedUserRole = function(role) {
      var roleIndex = lodash.findIndex($scope.user.roles, function(o) {
        return o === (role);
      });
      return (roleIndex > -1) ? true : false;
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
        $scope.expeditions = data;
      });
    };

    $scope.openAdminTeamLeadForm = function() {
      angular.element('#modal-admin-team-lead-editadd').modal('show');
      // $scope.closeFunction('#modal-admin-team-lead-editadd');
    };

    $scope.closeAdminTeamLeadForm = function() {
      angular.element('#modal-admin-team-lead-editadd').modal('hide');
    };

    $scope.openDeleteAdminTeamLead = function() {
      angular.element('#modal-delete-admin-team-lead').modal('show');
    };

    $scope.closeDeleteAdminTeamLead = function() {
      angular.element('#modal-delete-admin-team-lead').modal('hide');
    };

    $scope.openFormTeamMember = function() {
      angular.element('#modal-team-member-editadd').modal('show');
    };

    $scope.closeFormTeamMember = function() {
      angular.element('#modal-team-member-editadd').modal('hide');
    };

    $scope.openDeleteTeamMember = function(teamMember) {
      angular.element('#modal-team-member-delete').modal('show');
    };

    $scope.closeDeleteTeamMember = function() {
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
