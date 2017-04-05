(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamLeadDeleteController', TeamLeadDeleteController);

  TeamLeadDeleteController.$inject = ['$scope', '$http', 'TeamLeadBySchoolOrgsService'];

  function TeamLeadDeleteController($scope, $http, TeamLeadBySchoolOrgsService) {
    $scope.error = null;

    $scope.delete = function() {
      $http.delete('api/users/leaders/' + $scope.teamLead._id + '/team/' + $scope.team._id,
      {})
      .success(function(data, status, headers, config) {
        $scope.teamLead = '';
        $scope.error = null;
        $scope.closeFunction(true);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
