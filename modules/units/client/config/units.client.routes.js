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
        template: '<ui-view autoscroll="true"/>'
      })
      .state('units.list', {
        url: '',
        templateUrl: 'modules/units/client/views/list-units.client.view.html',
        controller: 'UnitsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'team lead', 'team lead pending', 'partner'],
          pageTitle: 'Units List'
        }
      })
      .state('units.create', {
        url: '/create',
        templateUrl: 'modules/units/client/views/form-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: newUnit
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Units Create'
        }
      })
      .state('units.draft', {
        url: '/:unitId/draft',
        templateUrl: 'modules/units/client/views/form-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: getUnit
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Draft Unit {{ unitResolve.title }}'
        }
      })
      .state('units.edit', {
        url: '/:unitId/edit',
        templateUrl: 'modules/units/client/views/form-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: getUnit
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Unit {{ unitResolve.title }}'
        }
      })
      .state('units.view', {
        url: '/:unitId',
        templateUrl: 'modules/units/client/views/view-unit.client.view.html',
        controller: 'UnitsController',
        controllerAs: 'vm',
        resolve: {
          unitResolve: getUnitFull
        },
        data:{
          roles: ['admin', 'team lead', 'team lead pending', 'partner'],
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

  getUnitFull.$inject = ['$stateParams', 'UnitsService'];

  function getUnitFull($stateParams, UnitsService) {
    return UnitsService.get({
      unitId: $stateParams.unitId,
      full: true
    }).$promise;
  }

  newUnit.$inject = ['UnitsService'];

  function newUnit(UnitsService) {
    var newUnitObj = new UnitsService();
    newUnitObj.stageOne = {
      essentialQuestions: []
    };
    return newUnitObj;
  }
})();
