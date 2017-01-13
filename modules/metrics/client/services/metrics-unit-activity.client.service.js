// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsUnitActivityService', MetricsUnitActivityService);

  MetricsUnitActivityService.$inject = ['$resource'];

  function MetricsUnitActivityService($resource) {
    return $resource('api/metrics/curriculum/units/monthlyTotals', {
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
