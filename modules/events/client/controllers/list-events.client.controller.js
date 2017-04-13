(function () {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['$scope', '$rootScope', '$timeout', 'EventsService', 'EventHelper', 'EventTypesService', 'moment'];

  function EventsListController($scope, $rootScope, $timeout, EventsService, EventHelper, EventTypesService, moment) {
    var vm = this;

    vm.filter = {
      type: '',
      typeName: '',
      timeFrame: 'Upcoming events',
      availability: '',
      searchString: '',
      startDate: '',
      endDate: ''
    };

    vm.clearFilters = function() {
      vm.filter = {
        type: '',
        typeName: '',
        timeFrame: '',
        availability: '',
        searchString: '',
        startDate: '',
        endDate: ''
      };
      vm.findEvents();
    };

    vm.findEvents = function() {
      EventsService.query({
        type: vm.filter.type,
        timeFrame: vm.filter.timeFrame,
        availability: vm.filter.availability,
        searchString: vm.filter.searchString,
        startDate: vm.filter.startDate,
        endDate: vm.filter.endDate,
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

    $scope.$on('$viewContentLoaded', function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    });

    vm.findEvents();

    vm.categorySelected = function(selection) {
      vm.filter.type = (selection) ? selection._id : '';
      vm.filter.typeName = (selection) ? selection.type : '';
      vm.findEvents();
    };

    vm.timeFrameSelected = function(selection) {
      vm.filter.timeFrame = selection;
      vm.findEvents();
    };

    vm.availabilitySelected = function(selection) {
      vm.filter.availability = selection;
      vm.findEvents();
    };

    vm.searchChange = function($event) {
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.filter.page = 1;
        vm.findEvents();
      }
    };

    vm.pageChanged = function() {
      vm.findEvents();
    };

    EventTypesService.query({
    }, function(data) {
      vm.eventTypes = data;
    });

    // vm.calendarView = 'month';
    // vm.calendarDate = new Date();

    vm.getEventDate = EventHelper.getEventDate;
    vm.getEventYear = EventHelper.getEventYear;
    vm.getEventTimeRange = EventHelper.getEventTimeRange;
    vm.getOpenSpots = EventHelper.getOpenSpots;
    vm.getDaysRemainingDeadline = EventHelper.getDaysRemainingDeadline;
    vm.getEventDayOfWeekLong = EventHelper.getEventDayOfWeekLong;
    vm.getEventDayOfWeekShort = EventHelper.getEventDayOfWeekShort;
  }
}());
