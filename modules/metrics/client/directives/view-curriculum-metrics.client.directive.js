(function() {
  'use strict';

  angular
    .module('metrics')
    .directive('viewCurriculumMetrics', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/metrics/client/views/view-curriculum-metrics.client.view.html',
        scope: true,
        controller: 'CurriculumMetricsController'
      };
    });
})();
