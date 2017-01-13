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
}());
