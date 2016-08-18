(function() {
  'use strict';

  angular
    .module('protocol-water-quality')
    .directive('viewProtocolWaterQuality', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-water-quality/client/views/view-protocol-water-quality.client.view.html',
        controller: 'ProtocolWaterQualityController',
        scope: false
      };
    });
})();
