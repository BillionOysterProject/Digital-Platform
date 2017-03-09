(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamMemberController', TeamMemberController);

  TeamMemberController.$inject = ['$scope', '$http', 'TeamMembersService', 'TeamsService', 'LeaderMemberService'];

  function TeamMemberController($scope, $http, TeamMembersService, TeamsService, LeaderMemberService) {
    TeamsService.query({
      byOwner: true
    }, function(data) {
      $scope.allTeams = data;
    });

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

    //i don't think this is getting called?? and if so should members be
    //getting removed from the /leaders service?
    // $scope.remove = function() {
    //   $http.delete('api/users/leaders/' + $scope.teamMember._id, {
    //     user: $scope.teamMember,
    //     team: $scope.team,
    //     organization: $scope.organization,
    //     teamOrOrg: 'team',
    //     role: 'team member pending'
    //   })
    //   .successCallback(function(data, status, headers, config) {
    //     $scope.closeFunction(true);
    //   })
    //   .errorCallback(function(data, status, headers, config) {
    //     $scope.error = data.message;
    //   });
    // };

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
