(function () {
  'use strict';

  angular
    .module('meta-tide-tables')
    .controller('TideTablesListController', TideTablesListController);

  TideTablesListController.$inject = ['$scope', 'TideTablesService'];

  function TideTablesListController($scope, TideTablesService) {
    var vm = this;

    vm.tides = TideTablesService.query();
  }
})();
