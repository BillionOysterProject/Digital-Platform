(function () {
  'use strict';

  angular
    .module('unit')
    .controller('UnitController', UnitController);

  UnitController.$inject = ['$scope'];

  function UnitController($scope) {
    var vm = this;
  }
})();