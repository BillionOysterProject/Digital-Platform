(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamMemberDeleteController', TeamMemberDeleteController);

  TeamMemberDeleteController.$inject = ['$scope', '$http', 'TeamMembersService', 'TeamsService', 'LeaderMemberService'];

  function TeamMemberDeleteController($scope, $http, TeamMembersService, TeamsService, LeaderMemberService) {

    $scope.remove = function() {
      $scope.teamMember.team = $scope.team;
      $scope.teamMember.$remove(function(err) {
        if(err) {
          console.log(err);
          errorCallback(err);
        } else {
          successCallback();
        }
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
