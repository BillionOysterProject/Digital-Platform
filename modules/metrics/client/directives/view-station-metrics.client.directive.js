(function() {
  'use strict';

  angular
    .module('metrics')
    .directive('viewStationMetrics', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/metrics/client/views/view-station-metrics.client.view.html',
        scope: true,
        controller: 'StationMetricsController'
      };
    });
})();
