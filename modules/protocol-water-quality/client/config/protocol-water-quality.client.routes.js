(function () {
  'use strict';

  angular
    .module('protocol-water-quality.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('protocol-water-quality', {
        abstract: true,
        url: '/protocol-water-quality',
        template: '<ui-view/>'
      })
      .state('protocol-water-quality.main', {
        url: '',
        templateUrl: 'modules/protocol-water-quality/client/views/protocol-water-quality.client.view.html',
        controller: 'ProtocolWaterQualityMainController',
        controllerAs: 'wq',
        data: {
          pageTitle: 'Protocol Water Quality'
        }
      })
      .state('protocol-water-quality.create', {
        url: '/create',
        templateUrl: 'modules/protocol-water-quality/client/views/form-protocol-water-quality.client.view.html',
        controller: 'ProtocolWaterQualityController',
        controllerAs: 'wq',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Protocol Water Quality Create'
        }
      })
      .state('protocol-water-quality.edit', {
        url: '/:protocolWaterQualityId/edit',
        templateUrl: 'modules/protocol-water-quality/client/views/form-protocol-water-quality.client.view.html',
        controller: 'ProtocolWaterQualityController',
        controllerAs: 'wq',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Edit Water Quality Conditions'
        }
      })
      .state('protocol-water-quality.view', {
        url: '/:protocolWaterQualityId',
        templateUrl: 'modules/protocol-water-quality/client/views/view-protocol-water-quality.client.view.html',
        controller: 'ProtocolWaterQualityController',
        controllerAs: 'wq',
        data: {
          pageTitle: 'Protocol Water Quality'
        }
      });
  }
})();