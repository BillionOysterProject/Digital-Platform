(function() {
  'use strict';

  angular
    .module('library')
    .controller('ReturnLessonsController', ReturnLessonsController);

  ReturnLessonsController.$inject = ['$scope', '$http'];

  function ReturnLessonsController($scope, $http) {
    $scope.return = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.returnLessonForm');
        return false;
      }

      $http.post('api/lessons/'+$scope.lesson._id+'/return', {
        returnedNotes: $scope.lesson.returnedNotes
      })
      .success(function(data, status, headers, config) {
        $scope.form.returnLessonForm.$setPristine();
        $scope.closeFunction(true);
      })
      .error(function(data, status, headers, config) {
        $scope.error = data.message;
      });
    };

    $scope.cancel = function() {
      $scope.form.returnLessonForm.$setPristine();
      $scope.lesson.returnedNotes = '';
      $scope.closeFunction();
    };
  }
})();
