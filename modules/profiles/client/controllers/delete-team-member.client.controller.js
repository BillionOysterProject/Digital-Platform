(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamMemberDeleteController', TeamMemberDeleteController);

  TeamMemberDeleteController.$inject = ['$scope', '$http', 'TeamMembersService', 'TeamsService', 'LeaderMemberService'];

  function TeamMemberDeleteController($scope, $http, TeamMembersService, TeamsService, LeaderMemberService) {
    TeamsService.query({
      byOwner: true
    }, function(data) {
      $scope.allTeams = data;
    });

    $scope.remove = function() {
      $http.delete('api/users/leaders/' + $scope.teamMember._id, {
        user: $scope.teamMember,
        team: $scope.team,
        organization: $scope.organization,
        teamOrOrg: 'team',
        role: 'team member pending'
      })
      .successCallback(function(data, status, headers, config) {
        $scope.closeFunction(true);
      })
      .errorCallback(function(data, status, headers, config) {
        $scope.error = data.message;
      });
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

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
