(function() {
  'use strict';

  angular
    .module('library')
    .directive('savedLessonModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/lessons/client/views/saved-lesson.client.view.html',
        scope: true
      };
    });
})();
