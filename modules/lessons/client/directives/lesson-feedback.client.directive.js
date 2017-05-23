(function() {
  'use strict';

  angular
    .module('lessons')
    .directive('lessonFeedbackModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/lessons/client/views/lesson-feedback.client.view.html',
        scope: {
          lesson: '=',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, $http) {
          $scope.sent = false;
          $scope.feedback = {};

          $scope.send = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.lessonFeedbackForm');
              return false;
            }

            $http.post('/api/lessons/' + $scope.lesson._id + '/feedback', {
              lesson: $scope.lesson,
              feedback: $scope.feedback
            })
            .success(function(data, status, headers, config) {
              $scope.sent = true;
            })
            .error(function(data, status, headers, config) {
              $scope.error = data.message;
            });
          };

          $scope.close = function() {
            $scope.form.lessonFeedbackForm.$setSubmitted(false);
            $scope.form.lessonFeedbackForm.$setPristine(true);
            $scope.sent = false;
            $scope.message = null;
            $scope.closeFunction(true);
          };
        },
        link: function(scope, element, attrs) {

        }
      };
    });
})();
