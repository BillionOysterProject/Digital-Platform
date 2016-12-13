(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamMemberController', TeamMemberController);

  TeamMemberController.$inject = ['$scope', '$http', 'TeamMembersService'];

  function TeamMemberController($scope, $http, TeamMembersService) {
    $scope.teamMember = ($scope.teamMember) ? new TeamMembersService($scope.teamMember) : new TeamMembersService();

    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.teamMemberForm');
        return false;
      }

      if ($scope.teamMember._id) {
        $scope.teamMember.$update(successCallback, errorCallback);
      } else {
        $scope.teamMember.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $scope.closeFunction();
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
        if ($scope.error.match('email already exists')) {
          $scope.error = 'Email address already exists in the system';
        }
      }
    };

    $scope.remove = function() {
      $scope.teamMember.$remove(function() {
        $scope.closeFunction();
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
