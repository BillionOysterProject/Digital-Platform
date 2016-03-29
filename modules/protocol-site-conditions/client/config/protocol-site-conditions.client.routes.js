(function () {
  'use strict';

  angular
    .module('protocol-site-conditions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('protocol-site-conditions', {
        abstract: true,
        url: '/protocol-site-conditions',
        template: '<ui-view/>'
      })
      .state('protocol-site-conditions.main', {
        url: '',
        templateUrl: 'modules/protocol-site-conditions/client/views/protocol-site-conditions.client.view.html',
        controller: 'ProtocolSiteConditionsMainController',
        controllerAs: 'sc',
        data: {
          pageTitle: 'Protocol Site Conditions'
        }
      })
      .state('protocol-site-conditions.create', {
        url: '/create',
        templateUrl: 'modules/protocol-site-conditions/client/views/form-protocol-site-condition.client.view.html',
        controller: 'ProtocolSiteConditionsController',
        controllerAs: 'sc',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Protocol Site Conditions Create'
        }
      })
      .state('protocol-site-conditions.edit', {
        url: '/:protocolSiteConditionId/edit',
        templateUrl: 'modules/protocol-site-conditions/client/views/form-protocol-site-condition.client.view.html',
        controller: 'ProtocolSiteConditionsController',
        controllerAs: 'sc',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Edit Protocol Site Conditions'
        }
      })
      .state('protocol-site-conditions.view', {
        url: '/:protocolSiteConditionId',
        templateUrl: 'modules/protocol-site-conditions/client/views/view-protocol-site-condition.client.view.html',
        controller: 'ProtocolSiteConditionsController',
        controllerAs: 'sc',
        data: {
          pageTitle: 'Protocol Site Condition'
        }
      });
  }
})();