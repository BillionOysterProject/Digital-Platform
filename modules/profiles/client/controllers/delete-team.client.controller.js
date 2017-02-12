(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamDeleteController', TeamDeleteController);

  TeamDeleteController.$inject = ['$scope', '$http', 'TeamsService'];

  function TeamDeleteController($scope, $http, TeamsService) {
    $scope.delete = function() {
      $scope.team.$remove(function() {
        $scope.closeFunction(true);
      });
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
