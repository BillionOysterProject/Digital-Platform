// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsExpeditionActivityService', MetricsExpeditionActivityService);

  MetricsExpeditionActivityService.$inject = ['$resource'];

  function MetricsExpeditionActivityService($resource) {
    return $resource('api/metrics/expeditions/monthlyTotals', {
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
