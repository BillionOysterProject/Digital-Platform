(function() {
  'use strict';

  angular
    .module('events.services')
    .factory('EventHelper', EventHelper);

  EventHelper.$inject = ['moment'];

  function EventHelper(moment) {
    var getEventDate = function(startDate) {
      return moment(startDate).format('MMM D');
    };

    var getEventMonthShort = function(startDate) {
      return moment(startDate).format('MMM');
    };

    var getEventDay = function(startDate) {
      return moment(startDate).format('D');
    };

    var getEventYear = function(startDate) {
      return moment(startDate).format('YYYY');
    };

    var getEventTimeRange = function(startDate, endDate) {
      return moment(startDate).format('h:mma') + '-' + moment(endDate).format('h:mma');
    };

    var getOpenSpots = function(registrants, maximumCapacity) {
      if (registrants && registrants.length >=0 && maximumCapacity && maximumCapacity >= 0) {
        return maximumCapacity - registrants.length;
      } else {
        return null;
      }
    };

    var getEarliestDate = function(dates) {
      var earliestDate = (dates && dates.length > 0) ?
        dates[0] : null;
      for (var j = 1; j < dates.length; j++) {
        if (moment(dates[j].startDateTime).isBefore(moment(earliestDate.startDateTime))) {
          earliestDate = dates[j];
        }
      }
      return earliestDate;
    };

    var getEarliestDateAsMoment = function(dates) {
      var date = getEarliestDate(dates);
      return (date) ? moment(date.startDateTime) : null;
    };

    var getEarliestDateString = function(dates) {
      var earliestDate = getEarliestDateAsMoment(dates);
      return (earliestDate) ? earliestDate.format('MMM D, YYYY') : '';
    };

    var getEarliestDateTimeRangeString = function(dates) {
      var earliestDate = getEarliestDate(dates);
      console.log('earliestDate', earliestDate);
      if (earliestDate) {
        return moment(earliestDate.startDateTime).format('MMMM D, YYYY, h:mma') + '-' +
          moment(earliestDate.endDateTime).format('h:mma');
      } else {
        return '';
      }
    };

    var getDaysRemaining = function(dates, deadlineToRegister) {
      var today = moment().endOf('day');
      if (deadlineToRegister) {
        var deadline = moment(deadlineToRegister).endOf('day');
        return deadline.diff(today, 'days');
      } else {
        var earliestDate = getEarliestDateAsMoment(dates);
        var earliest = (earliestDate) ? earliestDate.endOf('day') : null;
        return (earliest) ? earliest.diff(today, 'days') : null;
      }
    };

    return {
      getEventDate: getEventDate,
      getEventMonthShort: getEventMonthShort,
      getEventDay: getEventDay,
      getEventYear: getEventYear,
      getEventTimeRange: getEventTimeRange,
      getOpenSpots: getOpenSpots,
      getDaysRemaining: getDaysRemaining,
      getEarliestDate: getEarliestDate,
      getEarliestDateAsMoment: getEarliestDateAsMoment,
      getEarliestDateString: getEarliestDateString,
      getEarliestDateTimeRangeString: getEarliestDateTimeRangeString
    };
  }
})();
