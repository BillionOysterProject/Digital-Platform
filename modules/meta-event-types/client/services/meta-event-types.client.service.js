// Meta event types service used to communicate Meta event types REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-event-types.services')
    .factory('EventTypesService', EventTypesService);

  EventTypesService.$inject = ['$resource'];

  function EventTypesService($resource) {
    return $resource('api/event-types/:eventTypeId', {
      eventTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          searchString: '@searchString'
        },
        isArray: true
      }
    });
  }
}());
