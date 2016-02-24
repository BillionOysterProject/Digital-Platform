(function () {
  'use strict';

  angular
    .module('lessons.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lessons', {
        abstract: true,
        url: '/lessons',
        template: '<ui-view/>'
      })
      .state('lessons.list', {
        url: '',
        templateUrl: 'modules/lessons/client/views/list-lessons.client.view.html',
        controller: 'LessonsListController',
        controllerAs: 'vm',
        data: {
          roles: ['team lead'],
          pageTitle: 'Lessons List'
        }
      })
      .state('lessons.create', {
        url: '/create',
        templateUrl: 'modules/lessons/client/views/form-lesson.client.view.html',
        controller: 'LessonsController',
        controllerAs: 'vm',
        resolve: {
          lessonResolve: newLesson
        },
        data: {
          roles: ['team lead'],
          pageTitle: 'Lesson Create'
        }
      })
      .state('lessons.edit', {
        url: '/:lessonId/edit',
        templateUrl: 'modules/lessons/client/views/form-lesson.client.view.html',
        controller: 'LessonsController',
        controllerAs: 'vm',
        resolve: {
          lessonResolve: getLesson
        },
        data: {
          roles: ['team lead'],
          pageTitle: 'Edit Lesson {{ lessonResolve.title }}'
        }
      })
      .state('lessons.view', {
        url: '/:lessonId',
        templateUrl: 'modules/lessons/client/views/view-lesson.client.view.html',
        controller: 'LessonsController',
        controllerAs: 'vm',
        resolve: {
          lessonResolve: getLesson
        },
        data: {
          pageTitle: 'Lesson {{ lessonResolve.title }}'
        }
      });
  }

  getLesson.$inject = ['$stateParams', 'LessonsService'];

  function getLesson($stateParams, LessonsService) {
    return LessonsService.get({
      lessonId: $stateParams.lessonId
    }).$promise;
  }

  newLesson.$inject = ['LessonsService'];

  function newLesson(LessonsService) {
    return new LessonsService();
  }
})();