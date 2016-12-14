// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsService', MetricsService);

  MetricsService.$inject = ['$resource'];

  function MetricsService($resource) {
    return $resource('api/metrics/people', {
    }, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
}());
