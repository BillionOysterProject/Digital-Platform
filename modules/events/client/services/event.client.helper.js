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
        moment(dates[0].startDateTime) : null;
      for (var j = 1; j < dates.length; j++) {
        if (moment(dates[j].startDateTime).isBefore(earliestDate)) {
          earliestDate = moment(dates[j].startDateTime);
        }
      }
      return earliestDate;
    };

    var getEarliestDateString = function(dates) {
      var earliestDate = getEarliestDate(dates);
      return (earliestDate) ? earliestDate.format('MMM D, YYYY') : '';
    };

    var getEarliestDateTimeString = function(dates) {
      var earliestDate = getEarliestDate(dates);
      return (earliestDate) ? earliestDate.format('MMMM D, YYYY, h:mma-h:mma') : '';
    };

    var getDaysRemaining = function(dates, deadlineToRegister) {
      var today = moment();
      if (deadlineToRegister) {
        return moment(deadlineToRegister).diff(today, 'days');
      } else {
        var earliestDate = getEarliestDate(dates);
        return (earliestDate) ? earliestDate.diff(today, 'days') : null;
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
      getEarliestDateString: getEarliestDateString,
      getEarliestDateTimeString: getEarliestDateTimeString
    };
  }
})();
