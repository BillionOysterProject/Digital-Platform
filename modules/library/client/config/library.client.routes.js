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
          pageTitle: 'Library'
        }
      })
      .state('library.user', {
        url: '/user',
        templateUrl: 'modules/library/client/views/user-library.client.view.html',
        data: {
          pageTitle: 'User Library'
        }
      })
      .state('library.create', {
        url: '/create',
        templateUrl: 'modules/library/client/views/form-library.client.view.html',
        data: {
          pageTitle: 'Add Item to Library'
        }
      })
      .state('library.edit', {
        url: ':itemId/edit',
        templateUrl: 'modules/library/client/view/form-library.client.view.html',
        data: {
          pageTitle: 'Edit Item in Library'
        }
      })
      .state('library.view', {
        url: ':itemId',
        templateUrl: 'modules/library/client/views/view-item.client.view.html',
        data: {
          pageTitle: 'Item in Library'
        }
      });
  }
})();