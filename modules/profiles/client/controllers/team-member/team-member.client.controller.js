(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamMemberController', TeamMemberController);

  TeamMemberController.$inject = ['$scope', '$http', 'Authentication', 'TeamMembersService', 'TeamsService', 'LeaderMemberService',
    'ExpeditionViewHelper'];

  function TeamMemberController($scope, $http, Authentication, TeamMembersService, TeamsService, LeaderMemberService,
    ExpeditionViewHelper) {
    $scope.checkRole = ExpeditionViewHelper.checkRole;
    $scope.currentUser = Authentication.user;

    $scope.findCurrentUserTeams = function() {
      if ($scope.isCurrentUserAdmin || $scope.isCurrentUserTeamLead) {
        var byOwner = (($scope.isCurrentUserAdmin && $scope.isCurrentUserTeamLead) ||
          (!$scope.isCurrentUserAdmin && $scope.isCurrentUserTeamLead)) ? true : undefined;
        TeamsService.query({
          byOwner: byOwner,
        }, function(data) {
          $scope.allTeams = data;
        });
      }
    };

    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.teamMemberForm');
        return false;
      }

      if ($scope.teamMember._id) {
        $http.put('api/users/leaders/' + $scope.teamMember._id, {
          user: $scope.teamMember,
          oldTeam: $scope.team,
          newTeam: $scope.newTeam,
          oldOrganization: $scope.organization,
          newOrganization: $scope.organization,
          teamOrOrg: 'team',
          role: 'team member pending'
        })
        .success(successCallback)
        .error(errorCallback);
      } else {
        $http.post('api/users/leaders', {
          user: $scope.teamMember,
          team: $scope.team,
          organization: $scope.organization,
          teamOrOrg: 'team',
          role: 'team member pending'
        })
        .success(successCallback)
        .error(errorCallback);
      }
    };

    function successCallback(data, status, headers, config) {
      $scope.closeFunction(true);
    }

    function errorCallback(data, status, headers, config) {
      $scope.error = data.message;
      if ($scope.error.match('email already exists')) {
        $scope.error = 'Email address already exists in the system';
      }
    }

    $scope.checkCurrentUserIsUser = function() {
      if ($scope.teamMember && $scope.currentUser && $scope.teamMember.username && $scope.currentUser.username &&
      $scope.teamMember.username === $scope.currentUser.username) {
        return true;
      } else {
        return false;
      }
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
