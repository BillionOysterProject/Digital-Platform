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
}());
