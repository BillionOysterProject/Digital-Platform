(function () {
  'use strict';

  angular
    .module('unit.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('unit', {
        url: '/unit',
        templateUrl: 'modules/unit/client/views/unit.client.view.html',
        controller: 'UnitController',
        controllerAs: 'vm',
        data: {
          roles: ['teacher'],
          pageTitle: 'Unit'
        }
      });
  }
})();