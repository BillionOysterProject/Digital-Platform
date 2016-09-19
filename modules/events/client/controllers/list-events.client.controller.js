(function () {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['EventsService'];

  function EventsListController(EventsService) {
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
        endDate: vm.filter.endDate
      }, function (data) {
        vm.events = data;
      });
    };

    vm.findEvents();

    vm.calendarView = 'month';
    vm.calendarDate = new Date();
  }
}());
