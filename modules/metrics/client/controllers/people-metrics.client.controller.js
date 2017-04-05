(function () {
  'use strict';

  angular
    .module('metrics')
    .controller('PeopleMetricsController', PeopleMetricsController);

  PeopleMetricsController.$inject = ['$scope', '$rootScope', '$timeout', 'moment', 'lodash',
    'Authentication', 'MetricsUsersService', 'MetricsUsersAdminService', 'MetricsUserActivityService'];

  function PeopleMetricsController($scope, $rootScope, $timeout, moment, lodash,
    Authentication, MetricsUsersService, MetricsUsersAdminService, MetricsUserActivityService) {
    $scope.userToView = {};

    $scope.getPeopleMetrics = function() {
      if(!$scope.isAdmin) {
        MetricsUsersService.query({},
        function (data) {
          $scope.metrics = data;
          $scope.rolesPieData = [$scope.metrics.userCounts.teamMember, $scope.metrics.userCounts.teamLead];
          $scope.error = null;
          $timeout(function() {
            $rootScope.$broadcast('iso-method', { name:null, params:null });
          });
        }, function(error) {
          $scope.error = error.data.message;
        });
      } else {
        MetricsUsersAdminService.query({},
        function (data) {
          $scope.metrics = data;
          $scope.rolesPieData = [$scope.metrics.userCounts.teamMember, $scope.metrics.userCounts.teamLead, $scope.metrics.userCounts.admin];
          $scope.error = null;
          $timeout(function() {
            $rootScope.$broadcast('iso-method', { name:null, params:null });
          });
        }, function(error) {
          $scope.error = error.data.message;
        });
      }
    };

    $scope.getMostActiveUsers = function() {
      MetricsUserActivityService.query({
        startDate: $scope.userActivityFilter.month.start,
        endDate: $scope.userActivityFilter.month.end,
        userRole: $scope.userActivityFilter.userRole.value
      },
      function(data) {
        $scope.userActivityData = data;
      });
    };

    $scope.calculateTotalTeamMembers = function(activeUserItem) {
      var total = 0;
      if(activeUserItem.teams !== null && activeUserItem.teams !== undefined) {
        for(var i = 0; i < activeUserItem.teams.length; i++) {
          total += activeUserItem.teams[i].teamMembers.length;
        }
      }
      return total;
    };

    $scope.userActivityRoleSelected = function(roleObj) {
      $scope.userActivityFilter.userRole = roleObj;
      $scope.getMostActiveUsers();
    };

    $scope.userActivityMonthSelected = function(monthObj) {
      $scope.userActivityFilter.month = monthObj;
      $scope.getMostActiveUsers();
    };

    $scope.isAdminSelected = function() {
      return $scope.userActivityFilter.userRole.value === 'admin';
    };

    //initialization code
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;

    var checkRole = function(role) {
      var roleIndex = lodash.findIndex($scope.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    if($scope.user) {
      $scope.isAdmin = checkRole('admin');
    } else {
      $scope.isAdmin = false;
    }

    var calculateMonthTimeIntervals = function(numMonths) {
      var monthTimeIntervals = [];
      var prevMonth = moment().subtract(numMonths-1, 'months').startOf('month');
      var nextMonth = moment().add(1, 'months').startOf('month');
      while(prevMonth.get('month') !== nextMonth.get('month') ||
            prevMonth.get('year') !== nextMonth.get('year')) {
        monthTimeIntervals.push({
          start: moment(prevMonth).startOf('month').toDate(),
          end: moment(prevMonth).endOf('month').toDate(),
          name: prevMonth.format('MMMM')
        });
        prevMonth.add(1, 'months');
      }
      return monthTimeIntervals;
    };

    //month labels on timeline line charts are
    //a rolling window of the previous 7 months + current month
    $scope.monthHistoryLabels = calculateMonthTimeIntervals(8);
    //create a new array reverse order of the months array for dropdowns
    //so the most recent month shows up at the top of the dropdown
    $scope.monthHistoryLabelsReversed = $scope.monthHistoryLabels.slice().reverse();

    $scope.userRoleOptions = [
      { name: 'Team Leads', value: 'team lead' },
      { name: 'Team Members', value: 'team member' },
      { name: 'Admin', value: 'admin' }
    ];

    $scope.userActivityFilter = {
      month: $scope.monthHistoryLabelsReversed[0],
      userRole: $scope.userRoleOptions[0] //Team Leads is first so it works for admin and team lead roles
    };
    $scope.rolesPielabels = ['Team Members', 'Team Leads'];
    if($scope.isAdmin) {
      $scope.rolesPielabels.push('Admin');
    }
    $scope.getPeopleMetrics();
    $scope.getMostActiveUsers();

    $scope.openViewUserModal = function(user) {
      $scope.userToView = user || {};
      angular.element('#modal-profile-user').modal('show');
    };

    $scope.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };
  }
})();
