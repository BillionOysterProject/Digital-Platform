// Metrics service used to communicate to Metrics REST endpoints
(function () {
  'use strict';

  angular
    .module('metrics')
    .factory('MetricsCurriculumService', MetricsCurriculumService);

  MetricsCurriculumService.$inject = ['$resource'];

  function MetricsCurriculumService($resource) {
    return $resource('api/metrics/curriculum', {
    }, {
      query: {
        method: 'GET'
      }
    });
  }

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
