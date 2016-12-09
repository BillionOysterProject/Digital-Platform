(function() {
  'use strict';

  angular
    .module('lessons.services')
    .factory('LessonTrackerStatsService', LessonTrackerStatsService);

  LessonTrackerStatsService.$inject = ['$resource'];

  function LessonTrackerStatsService($resource) {
    return $resource('api/lessons/:lessonId/tracker-stats', {
      lessonId: '@lessonId'
    });
  }
})();
