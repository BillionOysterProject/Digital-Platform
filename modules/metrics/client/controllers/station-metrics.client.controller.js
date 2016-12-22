(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('StationMetricsController', StationMetricsController);

  StationMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'MetricsStationService'];

  function StationMetricsController($scope, $rootScope, $timeout, MetricsStationService) {
    $scope.getStationMetrics = function() {
      MetricsStationService.query({},
      function (data) {
        $scope.metrics = data;
        $scope.stationStatusPieData = [];
        $scope.stationStatusPieData.push(data.lostStationCount);
        $scope.stationStatusPieData.push(data.activeStationCount);
        $scope.protocolStatusPieData = [];
        $scope.protocolStatusPieLabels = [];
        var statusNames = Object.keys(data.protocolStatuses);
        for(var i = 0; i < statusNames.length; i++) {
          var prettyStatusName = statusNames[i];
          prettyStatusName = prettyStatusName[0].toUpperCase() + prettyStatusName.substr(1) + " Protocols";
          $scope.protocolStatusPieLabels.push(prettyStatusName);
          $scope.protocolStatusPieData.push(data.protocolStatuses[statusNames[i]]);
        }
        $scope.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        $scope.error = error.data.message;
      });
    };

    $scope.stationStatusPieLabels = ['Lost Stations', 'Active Stations'];
    $scope.getStationMetrics();
  }
})();
