(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('downloadLessonModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/lessons/client/views/download-lesson.client.view.html',
        scope: {
          lesson: '=',
          download: '=',
          downloadFunction: '=',
          cancelFunction: '=',
          unitFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
