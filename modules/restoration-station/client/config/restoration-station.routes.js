(function () {
  'use strict';

  angular
    .module('restoration-station.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('restoration-station', {
        url: '/restoration-station',
        templateUrl: 'modules/restoration-station/client/views/restoration-station.client.view.html',
        controller: 'RestorationStationController',
        controllerAs: 'vm',
        data: {
          roles: ['teacher'],
          pageTitle: 'Restoration Station'
        }
      });
  }
})();