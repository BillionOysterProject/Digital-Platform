(function() {
  'use strict';

  angular
    .module('metrics')
    .directive('viewEventMetrics', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/metrics/client/views/view-event-metrics.client.view.html',
        scope: true,
        controller: 'EventMetricsController'
      };
    });
})();
