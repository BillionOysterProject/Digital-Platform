(function() {
  'use strict';

  angular
    .module('lessons')
    .controller('LessonFeedbackController', LessonFeedbackController);

  LessonFeedbackController.$inject = ['$scope', '$http', 'LessonFeedbackService'];

  function LessonFeedbackController($scope, $http, LessonFeedbackService) {
    LessonFeedbackService.get({
      lessonId: $scope.lesson._id
    }, function(data) {
      $scope.feedback = data;
    });
  }
})();
