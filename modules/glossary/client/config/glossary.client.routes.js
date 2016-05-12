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
        controller: 'GlossaryController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead', 'team member', 'team lead pending', 'team member pending', 'partner'],
          pageTitle: 'Glossary'
        }
      });
  }
})();
