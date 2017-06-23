(function() {
  'use strict';

  angular
    .module('library')
    .controller('PublishLessonsController', PublishLessonsController);

  PublishLessonsController.$inject = ['$scope', '$http'];

  function PublishLessonsController($scope, $http) {
    $scope.publish = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.publishLessonForm');
        return false;
      }

      $http.post('api/lessons/'+$scope.lesson._id+'/publish', {})
      .success(function(data, status, headers, config) {
        $scope.form.publishLessonForm.$setPristine();
        $scope.closeFunction(true);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.cancel = function() {
      $scope.form.publishLessonForm.$setPristine();
      $scope.closeFunction();
    };
  }
})();
