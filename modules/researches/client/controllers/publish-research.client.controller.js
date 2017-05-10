(function() {
  'use strict';

  angular
    .module('researches')
    .controller('PublishResearchController', PublishResearchController);

  PublishResearchController.$inject = ['$scope', '$http'];

  function PublishResearchController($scope, $http) {
    $scope.publish = function(isValid) {
      if (!isValid) {
        $scope.broadcast('show-errors-check-validity', '$scope.form.publishResearchForm');
        return false;
      }

      $http.post('api/research/'+$scope.research._id+'/publish', {})
      .success(function(data, status, headers, config) {
        $scope.form.publishResearchForm.$setPristine();
        $scope.closeFunction(true);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.cancel = function() {
      $scope.form.publishResearchForm.$setPristine();
      $scope.closeFunction();
    };
  }
})();
