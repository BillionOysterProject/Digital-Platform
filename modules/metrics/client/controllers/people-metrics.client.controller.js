(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('PeopleMetricsController', PeopleMetricsController);

  PeopleMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'MetricsUsersService', 'MetricsUserActivityService'];

  function PeopleMetricsController($scope, $rootScope, $timeout, MetricsUsersService, MetricsUserActivityService) {
    console.log("IN PEOPLE METRICS CONTROLLER");
    $scope.getPeopleMetrics = function() {
      MetricsUsersService.query({},
      function (data) {
        $scope.metrics = data;
        $scope.piedata = [$scope.metrics.teamMemberCount, $scope.metrics.teamLeadCount, $scope.metrics.adminCount];
        $scope.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        $scope.error = error.data.message;
      });
    };

    $scope.getMostActiveUsers = function() {
      MetricsUserActivityService.query({
        //TODO: add startDate and endDate wire up select box
      }, function(data) {

      });
    };

    $scope.getPeopleMetrics();
    $scope.getMostActiveUsers();
  }
})();
