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
      });
      // .state('curriculum.overview', {
      //   url: '',
      //   templateUrl: 'modules/curriculum/client/views/node-graph.client.view.html',
      //   controller: 'CurriculumController',
      //   controllerAs: 'vm',
      //   data: {
      //     roles: ['admin', 'team lead', 'team lead pending'],
      //     pageTitle: 'Curriculumn'
      //   }
      // });
  }
})();
