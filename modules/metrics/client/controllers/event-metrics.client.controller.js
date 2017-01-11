(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('EventMetricsController', EventMetricsController);

  EventMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment',
  'MetricsEventService', 'MetricsEventActvityService'];

  function EventMetricsController($scope, $rootScope, $timeout, moment, MetricsEventService,
    MetricsEventActvityService) {

    $scope.getEventMetrics = function() {
      MetricsEventService.query({},
      function (data) {
        $scope.metrics = data;
        var eventTypePieLabels = [];
        if($scope.metrics.eventTypes !== undefined && $scope.metrics.eventTypes.length > 0) {
          for(var i = 0; i < $scope.metrics.eventTypes.length; i++) {
            eventTypePieLabels.push($scope.metrics.eventTypes[i].type);
          }
        }
        $scope.eventTypePieLabels = eventTypePieLabels;
        var eventTypePieData = [];
        if($scope.metrics.eventTypeCounts !== null && $scope.metrics.eventTypeCounts !== undefined) {
          for(var typeIndex = 0; typeIndex < $scope.eventTypePieLabels.length; typeIndex++) {
            var currType = $scope.eventTypePieLabels[typeIndex];
            var count = 0;
            for(var countIndex = 0; countIndex < $scope.metrics.eventTypeCounts.length; countIndex++) {
              if($scope.metrics.eventTypeCounts[countIndex].eventType === currType) {
                count = $scope.metrics.eventTypeCounts[countIndex].count;
              }
            }
            eventTypePieData.push(count);
          }
        }
        $scope.eventTypePieData = eventTypePieData;

        $scope.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        $scope.error = error.data.message;
      });
    };

    $scope.getMonthlyEventActivity = function() {
      var numMonthsToCount = $scope.monthHistoryLabels.length;
      MetricsEventActvityService.query({
        months: numMonthsToCount
      },
      function (eventData) {
        $scope.monthlyCountLineData.push(eventData);

        // MetricsExpeditionActivityService.query({
        //   months: numMonthsToCount
        // },
        // function (expeditionData) {
        //   $scope.monthlyCountLineData.push(expeditionData);
        // });
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

    // $scope.eventStatusPieLabels = ['Lost Stations', 'Active Stations'];
    // $scope.expeditionStatusPieLabels = ['Future Expeditions', 'Completed Expeditions'];
    $scope.monthlyCountLineLabels = ['Events'];
    $scope.monthlyCountLineData = [];
    $scope.getEventMetrics();
    $scope.getMonthlyEventActivity();
  }
})();
