(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('updatedLessonModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/lessons/client/views/updated-lesson.client.view.html',
        scope: true
      };
    });
})();
