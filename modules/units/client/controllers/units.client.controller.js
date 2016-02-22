(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope'];

  function UnitsController($scope) {
    var vm = this;
  }
})();