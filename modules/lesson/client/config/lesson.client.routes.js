(function () {
  'use strict';

  angular
    .module('lesson.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lesson', {
        url: '/lesson',
        templateUrl: 'modules/lesson/client/views/lesson.client.view.html',
        controller: 'LessonController',
        controllerAs: 'vm',
        data: {
          roles: ['teacher'],
          pageTitle: 'Lesson'
        }
      });
  }
})();