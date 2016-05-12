(function() {
  'use strict';

  angular
    .module('units')
    .directive('unitFeedbackModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/units/client/views/unit-feedback.client.view.html',
        scope: {
          unit: '=',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, $http) {
          $scope.sent = false;
          $scope.send = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.unitFeedbackForm');
              return false;
            }

            $http.post('/api/email/unit-feedback', {
              unit: $scope.unit,
              message: $scope.message
            })
            .success(function(data, status, headers, config) {
              $scope.sent = true;
            })
            .error(function(data, status, headers, config) {
              $scope.error = data.message;
            });
          };

          $scope.close = function() {
            $scope.form.unitFeedbackForm.$setSubmitted(false);
            $scope.form.unitFeedbackForm.$setPristine(true);
            $scope.sent = false;
            $scope.message = null;
            $scope.closeFunction();
          };
        },
        link: function(scope, element, attrs) {

        }
      };
    });
})();
