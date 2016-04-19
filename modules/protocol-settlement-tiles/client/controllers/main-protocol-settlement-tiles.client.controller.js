(function () {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .controller('ProtocolSettlementTilesMainController', ProtocolSettlementTilesMainController);

  ProtocolSettlementTilesMainController.$inject = ['$scope', 'ProtocolSettlementTilesService'];

  function ProtocolSettlementTilesMainController($scope, ProtocolSettlementTilesService) {
    var om = this;
  }
})();
