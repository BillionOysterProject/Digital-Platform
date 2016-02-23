(function () {
  'use strict';

  angular
    .module('units.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('units', {
        abstract: true,
        url: '/units',
        template: '<ui-view/>'
      })
      .state('units.list', {
        url: '',
        templateUrl: 'modules/units/client/views/list-units.client.view.html',
        controller: 'UnitsListController',
        controllerAs: 'vm',
        data: {
          roles: ['team lead'],
          pageTitle: 'Units List'
        }
      })
      .state('units.create', {
        url: '/create',
        templareUrl: 'modules/units/client/views/form-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: newUnit
        },
        data: {
          roles: ['team lead'],
          pateTitle: 'Units Create'
        }
      })
      .state('units.edit', {
        url: '/:unitId/edit',
        templateUrl: 'modules/units/client/view/form-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: getUnit
        },
        data: {
          roles: ['team lead'],
          pageTitle: 'Edit Unit {{ unitResolve.title }}'
        }
      })
      .state('units.view', {
        url: '/:unitId',
        templateUrl: 'modules/units/client/views/view-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: getUnit
        },
        data: {
          pageTitle: 'Unit {{ unitResolve.title }}'
        }
      });
  }

  getUnit.$inject = ['$stateParams', 'UnitsService'];

  function getUnit($stateParams, UnitsService) {
    return UnitsService.get({
      unitId: $stateParams.unitId
    }).$promise;
  }

  newUnit.$inject = ['UnitsService'];

  function newUnit(UnitsService) {
    return new UnitsService();
  }
})();