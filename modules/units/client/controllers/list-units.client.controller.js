(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsListController', UnitsListController);

  UnitsListController.$inject = ['UnitsService'];

  function UnitsListController(UnitsService) {
    var vm = this;

    vm.units = UnitsService.query();
  }
})();
