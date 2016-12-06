(function() {
  'use strict';

  angular
    .module('expeditions')
    .controller('ReturnExpeditionController', ReturnExpeditionController);

  ReturnExpeditionController.$inject = ['$scope', '$state', '$http'];

  function ReturnExpeditionController($scope, $state, $http) {
    $scope.return = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.returnExpeditionForm');
        return false;
      }
      var returnedNotes = $scope.expedition.returnedNotes;

      $scope.form.returnExpeditionForm.$setPristine();
      $scope.saveFunction(returnedNotes);
    };

    $scope.cancel = function() {
      $scope.form.returnExpeditionForm.$setPristine();
      $scope.cancelFunction();
    };
  }
})();
