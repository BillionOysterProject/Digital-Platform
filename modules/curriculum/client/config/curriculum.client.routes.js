(function () {
  'use strict';

  angular
    .module('curriculum.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('curriculum', {
        abstract: true,
        url: '/curriculum',
        template: '<ui-view/>'
      })
      .state('lesson', {
        url: '/lesson',
        templateUrl: 'modules/curriculum/client/views/lesson.client.view.html',
        controller: 'LessonController',
        controllerAs: 'vm',
        data: {
          roles: ['teacher'],
          pageTitle: 'Lesson'
        }
      })
      .state('unit', {
        url: '/unit',
        templateUrl: 'modules/curriculum/client/views/unit.client.view.html',
        controller: 'UnitController',
        controllerAs: 'vm',
        data: {
          roles: ['teacher'],
          pageTitle: 'Unit'
        }
      });
  }
})();