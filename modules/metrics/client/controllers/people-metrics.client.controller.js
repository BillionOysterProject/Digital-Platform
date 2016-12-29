(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('PeopleMetricsController', PeopleMetricsController);

  PeopleMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment',
    'MetricsUsersService', 'MetricsUserActivityService'];

  function PeopleMetricsController($scope, $rootScope, $timeout, moment,
    MetricsUsersService, MetricsUserActivityService) {
    $scope.getPeopleMetrics = function() {
      MetricsUsersService.query({},
      function (data) {
        $scope.metrics = data;
        $scope.rolesPieData = [$scope.metrics.teamMemberCount, $scope.metrics.teamLeadCount, $scope.metrics.adminCount];
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
        $scope.userActivityData = data;
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

    //create a new array reverse order of the months array for dropdowns
    //so the most recent month shows up at the top of the dropdown
    $scope.monthHistoryLabelsReversed = $scope.monthHistoryLabels.slice().reverse();

    $scope.rolesPielabels = ['Team Members', 'Team Leads', 'Admin'];
    $scope.getPeopleMetrics();
    $scope.getMostActiveUsers();
  }
})();
