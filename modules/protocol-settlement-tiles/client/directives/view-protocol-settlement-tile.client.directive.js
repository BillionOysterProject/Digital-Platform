(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .directive('viewProtocolSettlementTiles', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-settlement-tiles/client/views/view-protocol-settlement-tile.client.view.html',
        controller: 'ProtocolSettlementTilesController',
        scope: false
      };
    });
})();
