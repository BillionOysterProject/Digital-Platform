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
    vm.remove = remove;
    vm.save = save;

    // Remove existing Lesson
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.lesson.$remove($state.go('lessons.list'));
      }
    }

    // Save Lesson
    function save(isValid) {
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

      function errorCalback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();