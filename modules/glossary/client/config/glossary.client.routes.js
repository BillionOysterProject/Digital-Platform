(function () {
  'use strict';

  angular
    .module('glossary.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('glossary', {
        abstract: true,
        url: '/glossary',
        template: '<ui-view/>'
      })
      .state('glossary.main', {
        url: '',
        templateUrl: 'modules/glossary/client/views/glossary.client.view.html',
        data: {
          pageTitle: 'Glossary'
        }
      })
      .state('glossary.create', {
        url: '/create',
        templateUrl: 'modules/glossary/client/views/form-glossary.client.view.html',
        data: {
          pageTitle: 'Add Item to Glossary'
        }
      })
      .state('glossary.edit', {
        url: '/:itemId/edit',
        templateUrl: 'modules/glossary/client/views/form-glossary.client.view.html',
        data: {
          pageTitle: 'Edit Item in Glossary'
        }
      })
      .state('glossary.view', {
        url: '/:itemId',
        templateUrl: 'modules/glossary/client/views/view-item.client.view.html',
        data: {
          pageTitle: 'Item in Glossary'
        }
      });
  }
})();