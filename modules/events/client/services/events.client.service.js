// Events service used to communicate Events REST endpoints
(function () {
  'use strict';

  angular
    .module('events')
    .factory('EventsService', EventsService);

  EventsService.$inject = ['$resource'];

  function EventsService($resource) {
    return $resource('api/events/:eventId', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          byRegistrants: '@byRegistrants',
          userId: '@userId',
          category: '@category',
          searchString: '@searchString',
          startDate: '@startDate',
          endDate: '@endDate',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
}());
