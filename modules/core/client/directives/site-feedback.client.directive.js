(function() {
  'use strict';

  angular
    .module('core')
    .directive('siteFeedback', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/core/client/views/site-feedback.client.view.html',
        scope: true,
        controller: function($scope, $http) {
          $scope.save = function(isValid) {
            if ($scope.type === 'bug') {
              $http.post('/api/email/bug-report', {
                data: {
                  location: $scope.location,
                  issue: $scope.issue
                }
              })
              .success(function(data, status, headers, config) { })
              .error(function(data, status, headers, config) { });
            } else if ($scope.type === 'help') {
              $http.post('/api/email/help', {
                data: {
                  message: $scope.message,
                }
              })
              .success(function(data, status, headers, config) { })
              .error(function(data, status, headers, config) { });
            } else {
              $http.post('/api/email/general-feedback', {
                data: {
                  message: $scope.message,
                }
              })
              .success(function(data, status, headers, config) { })
              .error(function(data, status, headers, config) { });
            }
          };

          $scope.cancel = function() {
            $scope.form.siteFeedbackForm.$setSubmitted(false);
            $scope.form.siteFeedbackForm.$setPristine(true);
          };
        },
        link: function(scope, elem, attrs) {

        },
        replace: true
      };
    }]);
})();
