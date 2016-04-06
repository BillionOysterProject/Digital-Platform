(function() {
  'use strict';

  angular
    .module('library')
    .controller('CreatedLessonsController', CreatedLessonsController);

  CreatedLessonsController.$inject = ['$scope', 'LessonsService'];

  function CreatedLessonsController($scope, LessonsService) {
    var vm = this;

    vm.findCreatedLessons = function() {
      LessonsService.query({
        byCreator: true
      }, function(data) {
        vm.createdLessons = data;
      });
    };

    vm.findCreatedLessons();
  }
})();
