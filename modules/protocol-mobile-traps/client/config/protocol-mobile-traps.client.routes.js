(function () {
  'use strict';

  angular
    .module('protocol-mobile-traps.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('protocol-mobile-traps', {
        abstract: true,
        url: '/protocol-mobile-traps',
        template: '<ui-view/>'
      })
      .state('protocol-mobile-traps.main', {
        url: '',
        templateUrl: 'modules/protocol-mobile-traps/client/views/protocol-mobile-traps.client.view.html',
        controller: 'ProtocolMobileTrapsMainController',
        controllerAs: 'mt',
        data: {
          pageTitle: 'Protocol Oyster Measurements'
        }
      })
      .state('protocol-mobile-traps.create', {
        url: '/create',
        templateUrl: 'modules/protocol-mobile-traps/client/views/form-protocol-mobile-trap.client.view.html',
        controller: 'ProtocolMobileTrapsController',
        controllerAs: 'mt',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Protocol Mobile Trap Create'
        }
      })
      .state('protocol-mobile-traps.edit', {
        url: '/:protocolMobileTrapId/edit',
        templateUrl: 'modules/protocol-mobile-traps/client/views/form-protocol-mobile-trap.client.view.html',
        controller: 'ProtocolMobileTrapsController',
        controllerAs: 'mt',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Edit Protocol Mobile Trap'
        }
      })
      .state('protocol-mobile-traps.view', {
        url: '/:protocolMobileTrapId',
        templateUrl: 'modules/protocol-mobile-traps/client/views/view-protocol-mobile-trap.client.view.html',
        controller: 'ProtocolMobileTrapsController',
        controllerAs: 'mt',
        data: {
          pageTitle: 'Protocol Mobile Trap'
        }
      });
  }
})();