(function () {
  'use strict';

  angular
    .module('restoration-stations.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('restoration-stations', {
        abstract: true,
        url: '/restoration-stations',
        template: '<ui-view/>'
      })
      .state('restoration-stations.dashboard', {
        url: '',
        templateUrl: 'modules/restoration-stations/client/views/dashboard.client.view.html',
        controller: 'RestorationStationsDashboardController',
        controllerAs: 'vm',
        data: {
          roles: ['team lead', 'team member', 'partner', 'admin'],
          pageTitle: 'Restoration Stations Dashboard'
        }
      })
      .state('restoration-stations.list', {
        url: '/stations',
        templateUrl: 'modules/restoration-stations/client/views/list-stations.client.view.html',
        controller: 'RestorationStationsDashboardController',
        controllerAs: 'vm',
        data: {
          roles: ['team lead', 'team member', 'partner', 'admin'],
          pageTitle: 'Restoration Stations Dashboard'
        }
      });
  }
})();
