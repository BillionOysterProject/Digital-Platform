(function() {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .directive('viewProtocolOysterMeasurement', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-oyster-measurements/client/views/view-protocol-oyster-measurement.client.view.html',
        controller: 'ProtocolOysterMeasurementsController',
        scope: false
      };
    });
})();
