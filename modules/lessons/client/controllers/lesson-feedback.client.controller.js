(function() {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonFeedbackController', LessonFeedbackController);

  LessonFeedbackController.$inject = ['$scope', '$http', 'LessonFeedbackService'];

  function LessonFeedbackController($scope, $http, LessonFeedbackService) {
    $scope.getFeedback = function() {
      LessonFeedbackService.get({
        lessonId: $scope.lesson._id
      }, function(data) {
        $scope.feedback = data;
      });
    };
    $scope.getFeedback();
  }
})();
