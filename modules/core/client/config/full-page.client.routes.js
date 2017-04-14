(function () {
  'use strict';

  // Setting up route
  angular.module('core.full-page.routes').config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('full-page', {
          abstract: true,
          url: '/full-page',
          template: '<ui-view/>',
        })
        .state('full-page.research-view', {
          url: '/research/:researchId',
          templateUrl: 'modules/researches/client/views/download-research.client.view.html',
          controller: 'ResearchesController',
          controllerAs: 'vm',
          resolve: {
            researchResolve: getResearch
          }
        });
    }
  ]);

  getResearch.$inject = ['$stateParams', 'ResearchesService'];

  function getResearch($stateParams, ResearchesService) {
    return ResearchesService.get({
      researchId: $stateParams.researchId
    }).$promise;
  }
}());
