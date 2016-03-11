(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsListController', LessonsListController);

  LessonsListController.$inject = ['$scope', 'LessonsService'];

  function LessonsListController($scope, LessonsService) {
    var vm = this;

    vm.lessons = LessonsService.query();
  }
})();
