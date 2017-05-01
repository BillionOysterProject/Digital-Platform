(function() {
  'use strict';

  angular
    .module('researches')
    .directive('researchFeedbackModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/researches/client/views/research-feedback.client.view.html',
        scope: {
          research: '=',
          closeFunction: '='
        },
        replaces: true,
        controller: function($scope, $http) {
          $scope.sent = false;
          $scope.feedback = {};

          $scope.send = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.researchFeedbackForm');
              return false;
            }

            $http.post('/api/research/' + $scope.research._id + '/feedback', {
              research: $scope.research,
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
            $scope.form.researchFeedbackForm.$setSubmitted(false);
            $scope.form.researchFeedbackForm.$setPristine(true);
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
