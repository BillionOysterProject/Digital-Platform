(function () {
  'use strict';

  angular
    .module('expeditions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('expeditions', {
        abstract: true,
        url: '/expeditions',
        template: '<ui-view/>'
      })
      .state('expeditions.list', {
        url: '',
        templateUrl: 'modules/expeditions/client/views/list-expeditions.client.view.html',
        controller: 'ExpeditionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Expeditions List'
        }
      })
      .state('expeditions.create-protocols', {
        url: '/create/protocols',
        templateUrl: 'modules/expeditions/client/views/form-expedition-protocols.client.view.html',
        controller: 'ExpeditionsController',
        controllerAs: 'vm',
        resolve: {
          expeditionResolve: newExpedition
        },
        data: {
          roles: ['team member', 'team lead'],
          pageTitle : 'Expeditions Create'
        }
      })
      .state('expeditions.create', {
        url: '/create',
        templateUrl: 'modules/expeditions/client/views/form-expedition.client.view.html',
        controller: 'ExpeditionsController',
        controllerAs: 'vm',
        resolve: {
          expeditionResolve: newExpedition
        },
        data: {
          roles: ['team member', 'team lead'],
          pageTitle : 'Expeditions Create'
        }
      })
      .state('expeditions.edit', {
        url: '/:expeditionId/edit',
        templateUrl: 'modules/expeditions/client/views/form-expedition.client.view.html',
        controller: 'ExpeditionsController',
        controllerAs: 'vm',
        resolve: {
          expeditionResolve: getExpedition
        },
        data: {
          roles: ['team member', 'team lead'],
          pageTitle: 'Edit Expedition {{ expeditionResolve.title }}'
        }
      })
      .state('expeditions.view', {
        url: '/:expeditionId',
        templateUrl: 'modules/expeditions/client/views/view-expedition.client.view.html',
        controller: 'ExpeditionsController',
        controllerAs: 'vm',
        resolve: {
          expeditionResolve: getExpedition
        },
        data:{
          pageTitle: 'Expedition {{ expeditionResolve.title }}'
        }
      });
  }

  getExpedition.$inject = ['$stateParams', 'ExpeditionsService'];

  function getExpedition($stateParams, ExpeditionsService) {
    return ExpeditionsService.get({
      expeditionId: $stateParams.expeditionId
    }).$promise;
  }

  newExpedition.$inject = ['ExpeditionsService'];

  function newExpedition(ExpeditionsService) {
    return new ExpeditionsService();
  }
})();
