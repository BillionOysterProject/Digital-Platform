(function() {
  'use strict';

  angular
    .module('metrics')
    .directive('viewPeopleMetrics', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/metrics/client/views/view-people-metrics.client.view.html',
        scope: 'true',
        controller: 'PeopleMetricsController'
      };
    });
})();
