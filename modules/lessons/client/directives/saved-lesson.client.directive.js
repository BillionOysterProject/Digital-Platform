(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('savedLessonModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/lessons/client/views/saved-lesson.client.view.html',
        scope: true
      };
    });
})();
