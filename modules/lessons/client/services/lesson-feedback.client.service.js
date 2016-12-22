(function() {
  'use strict';

  angular
    .module('lessons.services')
    .factory('LessonFeedbackService', LessonFeedbackService);

  LessonFeedbackService.$inject = ['$resource'];

  function LessonFeedbackService($resource) {
    return $resource('api/lessons/:lessonId/feedback', {
      lessonId: '@lessonId'
    });
  }
})();
