(function () {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['EventsService', 'EventHelper', 'moment'];

  function EventsListController(EventsService, EventHelper, moment) {
    var vm = this;

    vm.filter = {
      category: '',
      searchString: '',
      startDate: '',
      endDate: ''
    };

    vm.findEvents = function() {
      EventsService.query({
        category: vm.filter.category,
        searchString: vm.filter.searchString,
        startDate: vm.filter.startDate,
        endDate: vm.filter.endDate,
        future: true
      }, function (data) {
        vm.events = data;
      });
    };

    vm.findEvents();

    // vm.calendarView = 'month';
    // vm.calendarDate = new Date();

    vm.getEventDate = EventHelper.getEventDate;
    vm.getEventYear = EventHelper.getEventYear;
    vm.getEventTimeRange = EventHelper.getEventTimeRange;
    vm.getOpenSpots = EventHelper.getOpenSpots;
    vm.getDaysRemainingDeadline = EventHelper.getDaysRemainingDeadline;
  }
}());
