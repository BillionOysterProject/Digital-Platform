(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('StationMetricsController', StationMetricsController);

  StationMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment', 'ChartJs',
  'MetricsStationService', 'MetricsStationActivityService', 'MetricsExpeditionActivityService'];

  function StationMetricsController($scope, $rootScope, $timeout, moment, ChartJsProvider,
    MetricsStationService, MetricsStationActivityService, MetricsExpeditionActivityService) {

    $scope.getStationMetrics = function() {
      MetricsStationService.query({},
      function (data) {
        $scope.metrics = data;
        $scope.stationStatusPieData = [];
        $scope.stationStatusPieData.push(data.stationCounts.lost);
        $scope.stationStatusPieData.push(data.stationCounts.active);
        $scope.stationStatusPieLabels = [];
        $scope.stationStatusPieLabels.push(data.stationCounts.lost + ' Lost Stations');
        $scope.stationStatusPieLabels.push(data.stationCounts.active + ' Active Stations');
        $scope.protocolStatusPieData = [];
        $scope.protocolStatusPieLabels = [];
        var prettyStatusName = '';
        var statusNames = Object.keys(data.protocolStatusCounts);
        for(var i = 0; i < statusNames.length; i++) {
          prettyStatusName = statusNames[i];
          prettyStatusName = prettyStatusName[0].toUpperCase() + prettyStatusName.substr(1) + ' Protocols';
          $scope.protocolStatusPieLabels.push(data.protocolStatusCounts[statusNames[i]] + ' ' + prettyStatusName);
          $scope.protocolStatusPieData.push(data.protocolStatusCounts[statusNames[i]]);
        }

        $scope.expeditionStatusPieLabels = [];
        $scope.expeditionStatusPieData = [];
        var expeditionStatusNames = Object.keys(data.expeditionCounts);
        for(i = 0; i < expeditionStatusNames.length; i++) {
          if(expeditionStatusNames[i] !== 'total') {
            prettyStatusName = expeditionStatusNames[i];
            prettyStatusName = prettyStatusName[0].toUpperCase() + prettyStatusName.substr(1) + ' Expeditions';
            $scope.expeditionStatusPieLabels.push(data.expeditionCounts[expeditionStatusNames[i]] + ' ' + prettyStatusName);
            $scope.expeditionStatusPieData.push(data.expeditionCounts[expeditionStatusNames[i]]);
          }
        }

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
      labelMonthDate.add(1, 'months');
    }

    $scope.stationStatusPieColors = ['#ea6158', '#4CAF50'];
    $scope.monthlyCountLineLabels = ['Stations', 'Expeditions'];
    $scope.monthlyCountLineData = [];
    $scope.getStationMetrics();
    $scope.getMonthlyActivity();
  }
})();
