// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsUsersService', MetricsUsersService);

  MetricsUsersService.$inject = ['$resource'];

  function MetricsUsersService($resource) {
    return $resource('api/metrics/people', {
    }, {
      query: {
        method: 'GET'
      }
    });
  }
}());
