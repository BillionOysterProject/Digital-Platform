// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsStationService', MetricsStationService);

  MetricsStationService.$inject = ['$resource'];

  function MetricsStationService($resource) {
    return $resource('api/metrics/stations', {
    }, {
      query: {
        method: 'GET'
      }
    });
  }
}());
