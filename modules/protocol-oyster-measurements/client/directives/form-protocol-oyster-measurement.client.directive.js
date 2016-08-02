(function() {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .directive('formProtocolOysterMeasurement', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/form-protocol-oyster-measurement.client.view.html',
        controller: 'ProtocolOysterMeasurementsController',
        scope: false
      };
    });
})();
