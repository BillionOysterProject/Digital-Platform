(function() {
  'use strict';

  angular
    .module('lessons.services')
    .factory('SavedLessonsService', SavedLessonsService);

  SavedLessonsService.$inject = ['$resource'];

  function SavedLessonsService($resource) {
    return $resource('api/lessons/favorites', {});
  }
})();
