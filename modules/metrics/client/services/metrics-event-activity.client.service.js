// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsEventActvityService', MetricsEventActvityService);

  MetricsEventActvityService.$inject = ['$resource'];

  function MetricsEventActvityService($resource) {
    return $resource('api/metrics/events/monthlyTotals', {
    }, {
      query: {
        method: 'GET',
        params: {
          months: '@months'
        },
        isArray: true
      }
    });
  }
}());
