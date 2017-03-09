(function () {
  'use strict';

  angular
    .module('metrics.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('metrics', {
        abstract: true,
        url: '/metrics',
        template: '<ui-view/>'
      })
      .state('metrics.dashboard', {
        url: '',
        templateUrl: 'modules/metrics/client/views/metrics.client.view.html',
        controller: 'MetricsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead'],
          pageTitle: 'Metrics'
        }
      });
  }
})();
