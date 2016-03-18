(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements.services')
    .factory('ProtocolOysterMeasurementsService', ProtocolOysterMeasurementsService);

  ProtocolOysterMeasurementsService.$inject = ['$resource'];

  function ProtocolOysterMeasurementsService($resource) {
    return $resource('api/protocol-oyster-measurements/:oysterMeasurementId', {
      oysterMeasurementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
