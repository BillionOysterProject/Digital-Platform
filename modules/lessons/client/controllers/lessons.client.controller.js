(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsController', LessonsController);

  LessonsController.$inject = ['$scope', '$state', 'lessonResolve', 'Authentication'];

  function LessonsController($scope, $state, lesson, Authentication) {
    var vm = this;

    vm.lesson = lesson;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    // Remove existing Lesson
    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.lesson.$remove($state.go('lessons.list'));
      }
    }

    // Save Lesson
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.lesson._id) {
        vm.lesson.$update(successCallback, errorCallback);
      } else {
        vm.lesson.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('lessons.view', {
          lessonId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.cancel = function() {
      $state.go('lessons.list');
    }

    $scope.$watch('$viewContentLoaded', function(event) {
      $(function () {
        $('.select2').select2();
        $('.select2create').select2({
          tags: true
        });
      });
    });
  }
})();