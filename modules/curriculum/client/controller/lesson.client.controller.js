(function () {
  'use strict';

  angular
    .module('curriculum')
    .controller('LessonController', LessonController);

  LessonController.$inject = ['$scope'];

  function LessonController($scope) {
    var vm = this;
  }
})();