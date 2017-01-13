// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsLessonActivityService', MetricsLessonActivityService);

  MetricsLessonActivityService.$inject = ['$resource'];

  function MetricsLessonActivityService($resource) {
    return $resource('api/metrics/curriculum/lessons/monthlyTotals', {
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
