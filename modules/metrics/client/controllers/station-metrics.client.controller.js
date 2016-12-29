(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('StationMetricsController', StationMetricsController);

  StationMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment',
  'MetricsStationService', 'MetricsStationActivityService', 'MetricsExpeditionActivityService'];

  function StationMetricsController($scope, $rootScope, $timeout, moment, MetricsStationService,
    MetricsStationActivityService, MetricsExpeditionActivityService) {

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
          prettyStatusName = prettyStatusName[0].toUpperCase() + prettyStatusName.substr(1) + ' Protocols';
          $scope.protocolStatusPieLabels.push(prettyStatusName);
          $scope.protocolStatusPieData.push(data.protocolStatuses[statusNames[i]]);
        }
        $scope.expeditionStatusPieData = [];
        $scope.expeditionStatusPieData.push(data.expeditions.futureCount);
        $scope.expeditionStatusPieData.push(data.expeditions.completedCount);

        $scope.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        $scope.error = error.data.message;
      });
    };

    //station count has to come first so make sure these run in sequence
    $scope.getMonthlyActivity = function() {
      var numMonthsToCount = $scope.monthHistoryLabels.length;
      MetricsStationActivityService.query({
        months: numMonthsToCount
      },
      function (stationData) {
        $scope.monthlyCountLineData.push(stationData);

        MetricsExpeditionActivityService.query({
          months: numMonthsToCount
        },
        function (expeditionData) {
          $scope.monthlyCountLineData.push(expeditionData);
        });
      });
    };


    //month labels on timeline line charts are
    //a rolling window of the previous 7 months + current month
    $scope.monthHistoryLabels = [];
    var labelMonthDate = moment().subtract(7, 'months');
    var nextMonth = moment().add(1, 'months').get('month');
    while(labelMonthDate.get('month') !== nextMonth) {
      $scope.monthHistoryLabels.push(labelMonthDate.format('MMMM'));
      labelMonthDate = labelMonthDate.add(1, 'months');
    }

    $scope.stationStatusPieLabels = ['Lost Stations', 'Active Stations'];
    $scope.expeditionStatusPieLabels = ['Future Expeditions', 'Completed Expeditions'];
    $scope.monthlyCountLineLabels = ['Stations', 'Expeditions'];
    $scope.monthlyCountLineData = [];
    $scope.getStationMetrics();
    $scope.getMonthlyActivity();
  }
})();
