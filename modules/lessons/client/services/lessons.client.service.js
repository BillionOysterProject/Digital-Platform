(function () {
  'use strict';

  angular
    .module('lessons.services')
    .factory('LessonsService', LessonsService);

  LessonsService.$inject = ['$resource'];

  function LessonsService($resource) {
    return $resource('api/lessons/:lessonId', {
      lessonId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
