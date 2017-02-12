(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamMemberDeleteController', TeamMemberDeleteController);

  TeamMemberDeleteController.$inject = ['$scope', '$http', 'TeamMembersDeleteService'];

  function TeamMemberDeleteController($scope, $http, TeamMembersDeleteService) {
    $scope.remove = function() {
      var teamMemberToDelete = new TeamMembersDeleteService($scope.teamMember);
      teamMemberToDelete.$remove(function(result) {
        successCallback();
      }, function(err) {
        errorCallback(err);
      });
    };

    function successCallback(data, status, headers, config) {
      $scope.closeFunction(true);
    }

    function errorCallback(data, status, headers, config) {
      $scope.error = data.message;
    }

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
