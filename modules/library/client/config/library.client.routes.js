(function () {
  'use strict';

  angular
    .module('library.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('library', {
        abstract: true,
        url: '/library',
        template: '<ui-view/>'
      })
      .state('library.main', {
        url: '',
        templateUrl: 'modules/library/client/views/library.client.view.html',
        data: {
          pageTitle: 'Library',
          roles: ['admin', 'team lead']
        }
      })
      .state('library.user', {
        url: '/user',
        templateUrl: 'modules/library/client/views/user-library.client.view.html',
        controller: 'LibraryController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'My Library',
          roles: ['admin', 'team lead']
        }
      });
  }
})();
