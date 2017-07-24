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
        template: '<ui-view autoscroll="true"/>'
      })
      .state('expeditions.list', {
        url: '',
        params: {
          active: {
            value: 'myexpeditions'
          }
        },
        templateUrl: 'modules/expeditions/client/views/list-expeditions.client.view.html',
        controller: 'ExpeditionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead', 'team member', 'partner', 'team lead pending', 'team member pending', 'user'],
          pageTitle: 'Expeditions List'
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
          roles: ['admin', 'team lead'],
          pageTitle : 'Expeditions Create'
        }
      })
      .state('expeditions.submitted', {
        url: '/submitted',
        templateUrl: 'modules/expeditions/client/views/submitted-expeditions.client.view.html',
        controller: 'SubmittedExpeditionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead', 'partner'],
          pageTitle: 'Submitted Expeditions'
        }
      })
      .state('expeditions.data', {
        url: '/data',
        templateUrl: 'modules/expeditions/client/views/data.client.view.html',
        controller: 'ExpeditionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead', 'team lead pending', 'team member', 'team member pending', 'partner', 'user', 'guest'],
          pageTitle: 'Data'
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
          roles: ['admin', 'team lead'],
          pageTitle: 'Edit Expedition {{ expeditionResolve.title }}'
        }
      })
      .state('expeditions.protocols', {
        url: '/:expeditionId/protocols',
        templateUrl: 'modules/expeditions/client/views/form-expedition-protocols.client.view.html',
        controller: 'ExpeditionProtocolsController',
        controllerAs: 'vm',
        resolve: {
          expeditionResolve: getFullExpedition
        },
        data: {
          roles: ['admin', 'team member', 'team lead'],
          pageTitle : 'Expedition Protocols'
        }
      })
      .state('expeditions.view', {
        url: '/:expeditionId',
        templateUrl: 'modules/expeditions/client/views/view-expedition.client.view.html',
        controller: 'ExpeditionProtocolsController',
        controllerAs: 'vm',
        resolve: {
          expeditionResolve: getFullExpedition
        },
        data:{
          roles: ['admin', 'team lead', 'team member', 'partner', 'team lead pending', 'team member pending', 'user'],
          pageTitle: 'Expedition {{ expeditionResolve.title }}'
        }
      });
  }

  getExpedition.$inject = ['$stateParams', 'ExpeditionsService'];

  function getExpedition($stateParams, ExpeditionsService) {
    return ExpeditionsService.get({
      expeditionId: $stateParams.expeditionId,
    }).$promise;
  }

  getFullExpedition.$inject = ['$stateParams', 'ExpeditionsService'];

  function getFullExpedition($stateParams, ExpeditionsService) {
    return ExpeditionsService.get({
      expeditionId: $stateParams.expeditionId,
      full: true
    }).$promise;
  }

  newExpedition.$inject = ['ExpeditionsService'];

  function newExpedition(ExpeditionsService) {
    return new ExpeditionsService();
  }
})();
