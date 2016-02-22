(function () {
  'use strict';

  angular
    .module('lesson')
    .controller('LessonController', LessonController);

  LessonController.$inject = ['$scope'];

  function LessonController($scope) {
    var vm = this;
  }
})();