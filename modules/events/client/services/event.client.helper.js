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

    var getEventDayOfWeekLong = function(startDate) {
      return moment(startDate).format('dddd');
    };

    var getEventDayOfWeekShort = function(startDate) {
      return moment(startDate).format('ddd');
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
      if (earliestDate) {
        return moment(earliestDate.startDateTime).format('MMMM D, YYYY, h:mma') + '-' +
          moment(earliestDate.endDateTime).format('h:mma');
      } else {
        return '';
      }
    };

    var getDateTimeRangeString = function(dates) {
      var dateStrings = [];
      for (var i = 0; i < dates.length; i++) {
        dateStrings.push(moment(dates[i].startDateTime).format('MMMM D, YYYY, h:mma') + '-' +
          moment(dates[i].endDateTime).format('h:mma'));
      }
      return dateStrings.join(' | ');
    };

    var getDeadline = function(dates, deadlineToRegister) {
      if (deadlineToRegister) {
        return moment(deadlineToRegister).endOf('day');
      } else {
        var earliestDate = getEarliestDateAsMoment(dates);
        return (earliestDate) ? earliestDate.endOf('day') : null;
      }
    };

    var getDaysRemainingDeadline = function(dates, deadlineToRegister) {
      var today = moment().endOf('day');
      var deadline = getDeadline(dates, deadlineToRegister);
      return (deadline) ? deadline.diff(today, 'days') : null;
    };

    var getDaysRemainingEvent = function(dates) {
      var today = moment().endOf('day');
      var earliestDate = getEarliestDateAsMoment(dates);
      var earliest = (earliestDate) ? earliestDate.endOf('day') : null;
      return (earliest) ? earliest.diff(today, 'days') : null;
    };

    return {
      getEventDate: getEventDate,
      getEventMonthShort: getEventMonthShort,
      getEventDay: getEventDay,
      getEventYear: getEventYear,
      getEventTimeRange: getEventTimeRange,
      getEventDayOfWeekLong: getEventDayOfWeekLong,
      getEventDayOfWeekShort: getEventDayOfWeekShort,
      getOpenSpots: getOpenSpots,
      getDeadline: getDeadline,
      getDaysRemainingDeadline: getDaysRemainingDeadline,
      getDaysRemainingEvent: getDaysRemainingEvent,
      getEarliestDate: getEarliestDate,
      getEarliestDateAsMoment: getEarliestDateAsMoment,
      getEarliestDateString: getEarliestDateString,
      getEarliestDateTimeRangeString: getEarliestDateTimeRangeString,
      getDateTimeRangeString: getDateTimeRangeString
    };
  }
})();
