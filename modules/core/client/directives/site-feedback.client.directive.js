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
          $scope.sent = false;
          $scope.send = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.siteFeedbackForm');
              return false;
            }

            if ($scope.type === 'bug') {
              $http.post('/api/email/bug-report', {
                subject: $scope.subject,
                location: $scope.location,
                issue: $scope.issue
              })
              .success(function(data, status, headers, config) {
                $scope.sent = true;
              })
              .error(function(data, status, headers, config) {
                $scope.error = data.message;
              });
            } else if ($scope.type === 'help') {
              $http.post('/api/email/help', {
                subject: $scope.subject,
                message: $scope.message,
              })
              .success(function(data, status, headers, config) {
                $scope.sent = true;
              })
              .error(function(data, status, headers, config) {
                $scope.error = data.message;
              });
            } else {
              $http.post('/api/email/general-feedback', {
                subject: $scope.subject,
                message: $scope.message,
              })
              .success(function(data, status, headers, config) {
                $scope.sent = true;
              })
              .error(function(data, status, headers, config) {
                $scope.error = data.message;
              });
            }
          };

          $scope.close = function() {
            $scope.form.siteFeedbackForm.$setSubmitted(false);
            $scope.form.siteFeedbackForm.$setPristine(true);
            $scope.type = null;
            $scope.subject = null;
            $scope.location = null;
            $scope.issue = null;
            $scope.message = null;
            $scope.sent = false;
            angular.element('#modal-feedback').modal('hide');
          };
        },
        link: function(scope, elem, attrs) {

        },
        replace: true
      };
    }]);
})();
