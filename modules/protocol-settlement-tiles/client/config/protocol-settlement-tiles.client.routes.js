(function () {
  'use strict';

  angular
    .module('protocol-settlement-tiles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('protocol-settlement-tiles', {
        abstract: true,
        url: '/protocol-settlement-tiles',
        template: '<ui-view/>'
      })
      .state('protocol-settlement-tiles.main', {
        url: '',
        templateUrl: 'modules/protocol-settlement-tiles/client/views/protocol-settlement-tiles.client.view.html',
        controller: 'ProtocolSettlementTilesMainController',
        controllerAs: 'st',
        data: {
          pageTitle: 'Protocol Settlement Tiles'
        }
      })
      .state('protocol-settlement-tiles.create', {
        url: '/create',
        templateUrl: 'modules/protocol-settlement-tiles/client/views/form-protocol-settlement-tile.client.view.html',
        controller: 'ProtocolSettlementTilesController',
        controllerAs: 'st',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Protocol Settlement Tiles Create'
        }
      })
      .state('protocol-settlement-tiles.edit', {
        url: '/:protocolSettlementTileId/edit',
        templateUrl: 'modules/protocol-settlement-tiles/client/views/form-protocol-settlement-tile.client.view.html',
        controller: 'ProtocolOysterMeasurementsController',
        controllerAs: 'st',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Edit Protocol Settlement Tiles'
        }
      })
      .state('protocol-settlement-tiles.view', {
        url: '/:protocolSettlementTileId',
        templateUrl: 'modules/protocol-settlement-tiles/client/views/view-protocol-settlement-tile.client.view.html',
        controller: 'ProtocolSettlementTilesController',
        controllerAs: 'st',
        data: {
          pageTitle: 'Protocol Settlement Tiles'
        }
      });
  }
})();
