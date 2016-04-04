(function () {
  'use strict';

  angular
    .module('curriculum')
    .controller('CurriculumController', CurriculumController);

  CurriculumController.$inject = ['$scope', 'UnitsService', 'UnitLessonsService'];

  function CurriculumController($scope, UnitsService, UnitLessonsService) {
    var vm = this;

    vm.units = UnitsService.query();

    vm.selectedUnit = function(unit) {
      vm.lessons = UnitLessonsService.query({
        unitId: unit._id
      });
    };
  }
})();
