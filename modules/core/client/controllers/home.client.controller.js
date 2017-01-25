'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'BasicMetricsService',
  function ($scope, Authentication, BasicMetricsService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    //pull in the metrics we want to show on the homepage
    var vm = this;
    vm.totalPeople=100;

    BasicMetricsService.query(function(data) {
      vm.metrics = data;
    }, function(error) {
      console.log(error);
      vm.error = error.data;
    });
  }
]);
