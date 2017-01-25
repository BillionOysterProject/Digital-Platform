(function () {
  'use strict';

  angular
    .module('core')
    .factory('BasicMetricsService', BasicMetricsService);

  BasicMetricsService.$inject = ['$resource'];

  function BasicMetricsService($resource) {
    return $resource('api/metrics/basic', {
    }, {
      query: {
        method: 'GET'
      }
    });
  }
})();
