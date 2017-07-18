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
          },
          data: {
            pageTitle: 'Research'
          }
        })
        .state('full-page.lesson-view', {
          url: '/lessons/:lessonId',
          templateUrl: 'modules/lessons/client/views/full-page-lesson.client.view.html',
          controller: 'LessonsController',
          controllerAs: 'vm',
          resolve: {
            lessonResolve: getLesson
          },
          data: {
            pageTitle: 'Lesson'
          }
        });
    }
  ]);

  getResearch.$inject = ['$stateParams', 'ResearchesService'];

  function getResearch($stateParams, ResearchesService) {
    return ResearchesService.get({
      researchId: $stateParams.researchId,
      fullPage: true
    }).$promise;
  }

  getLesson.$inject = ['$stateParams', 'LessonsService'];

  function getLesson($stateParams, LessonsService) {
    return LessonsService.get({
      lessonId: $stateParams.lessonId,
      full: true,
      fullPage: true
    }).$promise;
  }
}());
