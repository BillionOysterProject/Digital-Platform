(function () {
  'use strict';

  angular
    .module('protocol-settlement-tiles.services')
    .factory('ProtocolSettlementTilesService', ProtocolSettlementTilesService);

  ProtocolSettlementTilesService.$inject = ['$resource'];

  function ProtocolSettlementTilesService($resource) {
    return $resource('api/protocol-settlement-tiles/:settlementTileId', {
      settlementTileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
