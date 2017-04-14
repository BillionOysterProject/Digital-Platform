(function () {
  'use strict';

  angular
    .module('researches')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('researches', {
        abstract: true,
        url: '/research',
        template: '<ui-view/>'
      })
      .state('researches.list', {
        url: '',
        templateUrl: 'modules/researches/client/views/list-researches.client.view.html',
        controller: 'ResearchesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Researches List'
        }
      })
      .state('researches.user', {
        url: '/user',
        templateUrl: 'modules/researches/client/views/user-research.client.view.html',
        controller: 'ResearchesController',
        controllerAs: 'vm'
      })
      .state('researches.create', {
        url: '/create',
        templateUrl: 'modules/researches/client/views/form-research.client.view.html',
        controller: 'ResearchesController',
        controllerAs: 'vm',
        resolve: {
          researchResolve: newResearch
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Researches Create'
        }
      })
      .state('researches.view', {
        url: '/:researchId',
        templateUrl: 'modules/researches/client/views/view-research.client.view.html',
        controller: 'ResearchesController',
        controllerAs: 'vm',
        resolve: {
          researchResolve: getResearch
        },
      })
      .state('researches.edit', {
        url: '/:researchId/edit',
        templateUrl: 'modules/researches/client/views/form-research.client.view.html',
        controller: 'ResearchesController',
        controllerAs: 'vm',
        resolve: {
          researchResolve: getResearch
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Research {{ researchResolve.name }}'
        }
      })
      // .state('researches.view', {
      //   url: '/:researchId',
      //   templateUrl: 'modules/researches/client/views/view-research.client.view.html',
      //   controller: 'ResearchesController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     researchResolve: getResearch
      //   },
      //   data: {
      //     pageTitle: 'Research {{ researchResolve.name }}'
      //   }
      // })
      ;
  }

  getResearch.$inject = ['$stateParams', 'ResearchesService'];

  function getResearch($stateParams, ResearchesService) {
    return ResearchesService.get({
      researchId: $stateParams.researchId
    }).$promise;
  }

  newResearch.$inject = ['ResearchesService'];

  function newResearch(ResearchesService) {
    return new ResearchesService();
  }
}());
