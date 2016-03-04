(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsListController', ExpeditionsListController);

  ExpeditionsListController.$inject = ['ExpeditionsService'];

  function ExpeditionsListController(ExpeditionsService) {
    var vm = this;

    vm.expeditions = ExpeditionsService.query();
  }
})();
