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

    vm.getEventDate = function(startDate) {
      return moment(startDate).format('MMM D');
    };

    vm.getEventYear = function(startDate) {
      return moment(startDate).format('YYYY');
    };

    vm.getEventTimeRange = function(startDate, endDate) {
      return moment(startDate).format('h:mma') + '-' + moment(endDate).format('h:mma');
    };

    vm.getOpenSpots = function(registrants, maximumCapacity) {
      if (registrants && registrants.length >=0 && maximumCapacity && maximumCapacity >= 0) {
        return maximumCapacity - registrants.length;
      } else {
        return null;
      }
    };

    vm.getDaysRemaining = function(dates, deadlineToRegister) {
      var today = moment();
      if (deadlineToRegister) {
        return moment(deadlineToRegister).diff(today, 'days');
      } else {
        var earliestDate = (dates && dates.length > 0) ?
          moment(dates[0].startDateTime) : null;
        for (var j = 1; j < dates.length; j++) {
          if (moment(dates[j].startDateTime).isBefore(earliestDate)) {
            earliestDate = moment(dates[j].startDateTime);
          }
        }

        return earliestDate.diff(today, 'days');
      }
    };
  }
}());
