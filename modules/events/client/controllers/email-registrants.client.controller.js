(function () {
  'use strict';

  angular
    .module('events')
    .controller('EmailRegistrantsController', EmailRegistrantsController);

  EmailRegistrantsController.$inject = ['$scope', '$http'];

  function EmailRegistrantsController($scope, $http) {
    $scope.attendeesOnly = 'false';
    $scope.subject = '';
    $scope.message = '';
    $scope.footer = false;
    $scope.sent = false;

    $scope.sendEmail = function() {
      $http.post('/api/events/'+$scope.event._id+'/email-registrants', {
        attendeesOnly: ($scope.attendeesOnly === 'true') ? true : false,
        subject: $scope.subject,
        message: $scope.message,
        footer: $scope.footer,
        dateTimeString: $scope.dateTimeString
      }).
      success(function(data, status, headers, config) {
        $scope.sent = true;
      }).
      error(function(data, status, headers, config) {
        $scope.error = data.message;
        console.log('$scope.error', $scope.error);
      });
    };
  }
}());
