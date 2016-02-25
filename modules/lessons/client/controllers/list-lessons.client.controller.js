(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsListController', LessonsListController);

  LessonsListController.$inject = ['$scope', 'LessonsService'];

  function LessonsListController($scope, LessonsService) {
    var vm = this;

    vm.lessons = LessonsService.query();

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
