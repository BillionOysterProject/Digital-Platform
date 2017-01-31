(function() {
  'use strict';

  angular
    .module('teams')
    .controller('TeamDeleteController', TeamDeleteController);

  TeamDeleteController.$inject = ['$scope', '$http', 'TeamsService'];

  function TeamDeleteController($scope, $http, TeamsService) {
    console.log('team', $scope.team);
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
