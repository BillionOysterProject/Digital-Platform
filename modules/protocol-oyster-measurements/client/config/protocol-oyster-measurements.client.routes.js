(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('protocol-oyster-measurements', {
        abstract: true,
        url: '/protocol-oyster-measurements',
        template: '<ui-view/>'
      })
      .state('protocol-oyster-measurements.main', {
        url: '',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/protocol-oyster-measurements.client.view.html',
        controller: 'ProtocolOysterMeasurementsMainController',
        controllerAs: 'om',
        data: {
          pageTitle: 'Protocol Oyster Measurements'
        }
      })
      .state('protocol-oyster-measurements.create', {
        url: '/create',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/form-protocol-oyster-measurement.client.view.html',
        controller: 'ProtocolOysterMeasurementsController',
        controllerAs: 'om',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Protocol Oyster Measurements Create'
        }
      })
      .state('protocol-oyster-measurements.edit', {
        url: '/:protocolOysterMeasurementId/edit',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/form-protocol-oyster-measurement.client.view.html',
        controller: 'ProtocolOysterMeasurementsController',
        controllerAs: 'om',
        data: {
          roles: ['team lead', 'team member', 'admin'],
          pageTitle: 'Edit Protocol Oyster Measurements'
        }
      })
      .state('protocol-oyster-measurements.view', {
        url: '/:protocolOysterMeasurementId',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/view-protocol-oyster-measurement.client.view.html',
        controller: 'ProtocolOysterMeasurementsController',
        controllerAs: 'om',
        data: {
          pageTitle: 'Protocol Oyster Measurement'
        }
      });
  }
})();