(function() {
  'use strict';

  angular
    .module('researches')
    .controller('ReturnResearchController', ReturnResearchController);

  ReturnResearchController.$inject = ['$scope', '$http'];

  function ReturnResearchController($scope, $http) {
    $scope.return = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.returnResearchForm');
        return false;
      }

      $http.post('api/research/'+$scope.research._id+'/return', {
        returnedNotes: $scope.research.returnedNotes
      })
      .success(function(data, status, headers, config) {
        $scope.form.returnResearchForm.$setPristine();
        $scope.closeFunction(true);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.cancel = function() {
      $scope.form.returnResearchForm.$setPristine();
      $scope.research.returnedNotes = '';
      $scope.closeFunction();
    };
  }
})();
