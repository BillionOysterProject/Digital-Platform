(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamsListController', TeamsListController);

  TeamsListController.$inject = ['$scope', 'TeamsService'];

  function TeamsListController($scope, TeamsService) {
    var vm = this;

    vm.teams = TeamsService.all.query();
  }
})();
