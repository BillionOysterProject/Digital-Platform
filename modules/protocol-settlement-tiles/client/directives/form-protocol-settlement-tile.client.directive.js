(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .directive('formProtocolSettlementTiles', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-settlement-tiles/client/views/form-protocol-settlement-tile.client.view.html',
        controller: 'ProtocolSettlementTilesController',
        scope: false
      };
    });
})();
