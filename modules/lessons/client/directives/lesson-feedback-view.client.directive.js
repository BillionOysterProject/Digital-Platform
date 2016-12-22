(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('lessonFeedbackViewModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/lessons/client/views/lesson-feedback-view.client.view.html',
        scope: {
          lesson: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'LessonFeedbackController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.getFeedback();
          });
        }
      };
    });
})();
