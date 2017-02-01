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

  angular
    .module('metrics')
    .factory('MetricsUsersAdminService', MetricsUsersAdminService);

  MetricsUsersAdminService.$inject = ['$resource'];

  function MetricsUsersAdminService($resource) {
    return $resource('api/metrics/people-with-admin', {
    }, {
      query: {
        method: 'GET'
      }
    });
  }

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
          endDate: '@endDate',
          userRole: '@userRole'
        },
        isArray: true
      }
    });
  }
}());
