(function () {
  'use strict';

  angular
    .module('meta-tide-tables.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('meta-tide-tables.list', {
        url: '',
        templateUrl: 'modules/meta-tide-tables/client/views/tide-tables.client.view.html',
        controller: 'TideTablesListController',
        controllerAs: 'vm',
        data: {
          roles: ['*'],
          pageTitle: 'Tide Tables'
        }
      });
  }
})();