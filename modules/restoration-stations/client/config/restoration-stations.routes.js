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
        url: '/restoration',
        template: '<ui-view/>'
      })
      .state('restoration-stations.dashboard', {
        url: '',
        templateUrl: 'modules/restoration-stations/client/views/dashboard.client.view.html',
        controller: 'RestorationStationsDashboardController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead', 'team member', 'partner', 'team lead pending', 'team member pending'],
          pageTitle: 'Restoration Stations Dashboard'
        }
      })
      .state('restoration-stations.list', {
        url: '/stations',
        templateUrl: 'modules/restoration-stations/client/views/list-stations.client.view.html',
        controller: 'RestorationStationListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead', 'team member', 'partner', 'team lead pending', 'team member pending'],
          pageTitle: 'Restoration Stations Dashboard'
        }
      });
  }
})();
