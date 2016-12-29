// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsStationActivityService', MetricsStationActivityService);

  MetricsStationActivityService.$inject = ['$resource'];

  function MetricsStationActivityService($resource) {
    return $resource('api/metrics/stations/monthlyTotals', {
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
