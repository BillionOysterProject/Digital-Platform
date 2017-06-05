(function() {
  'use strict';

  angular
    .module('core')
    .directive('shareEmail', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/core/client/views/share-email.client.view.html',
        scope: {
          modalHeader: '@',
          shareSubject: '@',
          shareMessage: '@',
          shareLink: '@',
          closeFunction: '='
        },
        controller: function($scope, $http) {
          $scope.sent = false;
          $scope.toName = null;
          $scope.toEmail = null;

          $scope.send = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.shareEmailForm');
              return false;
            }

            $http.post('/api/email/share', {
              toName: $scope.toName.trim(),
              toEmail: $scope.toEmail.trim(),
              subject: $scope.shareSubject.trim(),
              message: $scope.shareMessage.trim(),
              link: $scope.shareLink
            })
            .success(function(data, status, headers, config) {
              $scope.sent = true;
            })
            .error(function(data, status, headers, config) {
              $scope.error = data.message;
            });

            $scope.close = function() {
              $scope.closeFunction($scope.sent);
              $scope.form.shareEmailForm.$setSubmitted(false);
              $scope.form.shareEmailForm.$setPristine(true);
              $scope.toEmail = null;
              $scope.toName = null;
              $scope.sent = false;
              angular.element('#modal-share-email').modal('hide');
            };
          };
        },
        link: function(scope, elem, attrs) {

        },
        replace: true
      };
    }]);
})();
