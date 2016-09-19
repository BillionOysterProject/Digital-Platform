(function () {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['EventsService', 'moment'];

  function EventsListController(EventsService, moment) {
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

    // vm.calendarView = 'month';
    // vm.calendarDate = new Date();

    vm.getEventDatesSame = function(startDate, endDate) {
      var beginStartDate = moment(startDate).startOf('day').toDate();
      var beginEndDate = moment(endDate).startOf('day').toDate();
      return beginStartDate === beginEndDate;
    };

    vm.getEventYear = function(startDate, endDate) {

    };
  }
}());
