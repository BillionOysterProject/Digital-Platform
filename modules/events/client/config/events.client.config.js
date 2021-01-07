(function () {
  'use strict';

  angular
    .module('events')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Events Events',
      //state: 'events.list',
      href: 'https://www.eventbrite.com/o/billion-oyster-project-9718066591',
      // state: 'events',
      // type: 'dropdown',
      roles: ['*'],
      icon: 'glyphicon glyphicon-calendar',
      position: 5
    });

    // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'events', {
    //   title: 'Events',
    //   state: 'events.list'
    // });

    // Add the dropdown calendar item
    // Menus.addSubMenuItem('topbar', 'events', {
    //   title: 'Calendar',
    //   state: 'events.calendar'
    // });

    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'events', {
    //   title: 'Create Event',
    //   state: 'events.create',
    //   roles: ['user']
    // });
  }

  angular
    .module('events')
    .config(function(calendarConfig) {
      calendarConfig.dateFormatter = 'moment'; //use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.
      calendarConfig.allDateFormats.moment.date.hour = 'HH:mm'; //this will configure times on the day view to display in 24 hour format rather than the default of 12 hour
      calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM'; //this will configure the day view title to be shorter
      calendarConfig.i18nStrings.weekNumber = 'Week {week}'; //This will set the week number hover label on the month view
      calendarConfig.displayAllMonthEvents = true; //This will display all events on a month view even if they're not in the current month. Default false.
      calendarConfig.showTimesOnWeekView = true; //Make the week view more like the day view, with the caveat that event end times are ignored.
    });
}());
