(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonsListController', LessonsListController);

  LessonsListController.$inject = ['LessonsService'];

  function LessonsListController(LessonsService) {
    var vm = this;

    vm.lessons = LessonsService.query();
  }
})();
