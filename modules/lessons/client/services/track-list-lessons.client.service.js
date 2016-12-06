(function() {
  'use strict';

  angular
    .module('lessons.services')
    .factory('LessonTrackerListService', LessonTrackerListService);

  LessonTrackerListService.$inject = ['$resource'];

  function LessonTrackerListService($resource) {
    return $resource('api/lessons/:lessonId/tracked-list', {
      lessonId: '@lessonId'
    }, {
      'query':  {
        method:'GET',
        params: {
        },
        isArray: true
      }
    });
  }
})();
