(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamLeadDeleteController', TeamLeadDeleteController);

  TeamLeadDeleteController.$inject = ['$scope', '$http'];

  function TeamLeadDeleteController($scope, $http) {
    $scope.remove = function() {
      $http.delete('api/users/leaders/' + $scope.teamLead._id + '/team/' + $scope.team._id,
      {})
      .success(function(data, status, headers, config) {
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
