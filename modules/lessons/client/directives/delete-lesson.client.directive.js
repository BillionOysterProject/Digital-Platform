(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('deleteLessonModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/lessons/client/views/delete-lesson.client.view.html',
        scope: {
          callbackFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
