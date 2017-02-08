(function () {
  'use strict';

  angular
    .module('researches')
    .controller('ResearchesListController', ResearchesListController);

  ResearchesListController.$inject = ['ResearchesService'];

  function ResearchesListController(ResearchesService) {
    var vm = this;

    vm.researches = ResearchesService.query();
  }
}());
