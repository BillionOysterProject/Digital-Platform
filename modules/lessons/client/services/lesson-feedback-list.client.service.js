(function() {
  'use strict';

  angular
    .module('lessons.services')
    .factory('LessonFeedbackListService', LessonFeedbackListService);

  LessonFeedbackListService.$inject = ['$resource'];

  function LessonFeedbackListService($resource) {
    return $resource('api/lessons/:lessonId/feedback-list', {
      lessonId: '@lessonId'
    }, {
      'query': {
        method: 'GET',
        params: {
        },
        isArray: true
      }
    });
  }
})();
