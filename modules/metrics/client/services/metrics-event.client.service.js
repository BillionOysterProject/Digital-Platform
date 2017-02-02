// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsEventService', MetricsEventService);

  MetricsEventService.$inject = ['$resource'];

  function MetricsEventService($resource) {
    return $resource('api/metrics/events', {
    }, {
      query: {
        method: 'GET'
      }
    });
  }

  angular
    .module('metrics')
    .factory('MetricsEventStatisticsService', MetricsEventStatisticsService);

  MetricsEventStatisticsService.$inject = ['$resource'];

  function MetricsEventStatisticsService($resource) {
    return $resource('api/metrics/events/statistics', {
    }, {
      query: {
        method: 'GET',
        params: {
          startDate: '@startDate',
          endDate: '@endDate',
          sort: '@sort'
        },
        isArray: true
      }
    });
  }

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
