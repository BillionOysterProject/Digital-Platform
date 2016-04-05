(function() {
  'use strict';

  angular
    .module('glossary')
    .controller('TermController', TermController);

  TermController.$inject = ['$scope'];

  function TermController($scope) {
    $scope.error = null;

    $scope.remove = function() {
      $scope.term.$remove($scope.saveFunction());
    };

    $scope.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.termForm');
        return false;
      }

      if ($scope.term._id) {
        $scope.term.$update(successCallback, errorCallback);
      } else {
        $scope.term.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var termId = res._id;
        $scope.saveFunction();
        $scope.form.termForm.$setPristine();
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    };

    $scope.cancel = function() {
      $scope.cancelFunction();
      $scope.form.termForm.$setPristine();
    };
  }
})();
