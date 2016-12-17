// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsUserActivityService', MetricsUserActivityService);

  MetricsUserActivityService.$inject = ['$resource'];

  function MetricsUserActivityService($resource) {
    return $resource('api/metrics/activeUsers', {
    }, {
      query: {
        method: 'GET',
        params: {
          startDate: '@startDate',
          endDate: '@endDate'
        },
        isArray: true
      }
    });
  }
}());
