// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

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
}());
