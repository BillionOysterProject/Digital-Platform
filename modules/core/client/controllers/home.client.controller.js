'use strict';

angular.module('core').controller('HomeController', ['$scope', '$rootScope', '$timeout',
  'Authentication', 'BasicMetricsService', 'EventsService', 'EventHelper',
  function ($scope, $rootScope, $timeout, Authentication, BasicMetricsService, EventsService, EventHelper) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    //pull in the metrics we want to show on the homepage
    var vm = this;

    vm.findEvents = function() {
      EventsService.query({
        type: '',
        timeFrame: 'Upcoming events',
        availability: '',
        searchString: '',
        startDate: '',
        endDate: '',
        limit: 3
      }, function (data) {
        vm.events = data;
        vm.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        vm.error = error.data.message;
      });
    };

    vm.getEventDate = EventHelper.getEventDate;
    vm.getEventYear = EventHelper.getEventYear;
    vm.getEventTimeRange = EventHelper.getEventTimeRange;
    vm.getOpenSpots = EventHelper.getOpenSpots;
    vm.getDaysRemainingDeadline = EventHelper.getDaysRemainingDeadline;

    BasicMetricsService.query(function(data) {
      vm.metrics = data;
    }, function(error) {
      console.log(error);
      vm.error = error.data;
    });

    vm.findEvents();
  }
]);
