(function() {
  'use strict';

  angular
    .module('protocol-water-quality')
    .directive('formProtocolWaterQuality', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-water-quality/client/views/form-protocol-water-quality.client.view.html',
        controller: 'ProtocolWaterQualityController',
        scope: false
      };
    });
})();
