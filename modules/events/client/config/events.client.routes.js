(function () {
  'use strict';

  angular
    .module('events')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('events', {
        abstract: true,
        url: '/events',
        template: '<ui-view autoscroll="true"/>'
      })
      .state('events.list', {
        url: '',
        templateUrl: 'modules/events/client/views/list-events.client.view.html',
        controller: 'EventsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Events List'
        }
      })
      .state('events.calendar', {
        url: '/calendar',
        templateUrl: 'modules/events/client/views/calendar.client.view.html',
        controller: 'EventsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Calendar'
        }
      })
      .state('events.create', {
        url: '/create',
        templateUrl: 'modules/events/client/views/form-event.client.view.html',
        controller: 'EventsController',
        controllerAs: 'vm',
        resolve: {
          eventResolve: newEvent
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Events Create'
        }
      })
      .state('events.edit', {
        url: '/:eventId/edit',
        templateUrl: 'modules/events/client/views/form-event.client.view.html',
        controller: 'EventsController',
        controllerAs: 'vm',
        resolve: {
          eventResolve: getEvent
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Event {{ eventResolve.name }}'
        }
      })
      .state('events.duplicate', {
        url: '/:eventId/duplicate',
        templateUrl: 'modules/events/client/views/form-event.client.view.html',
        controller: 'EventsController',
        controllerAs: 'vm',
        resolve: {
          eventResolve: getEventDuplicate
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Duplicate Event'
        }
      })
      .state('events.view', {
        url: '/:eventId',
        templateUrl: 'modules/events/client/views/view-event.client.view.html',
        controller: 'EventsController',
        controllerAs: 'vm',
        resolve: {
          eventResolve: getEvent
        },
        data: {
          pageTitle: 'Event {{ eventResolve.name }}'
        }
      });
  }

  getEvent.$inject = ['$stateParams', 'EventsService'];

  function getEvent($stateParams, EventsService) {
    return EventsService.get({
      eventId: $stateParams.eventId,
      full: true
    }).$promise;
  }

  getEventDuplicate.$inject = ['$stateParams', 'EventsService'];

  function getEventDuplicate($stateParams, EventsService) {
    return EventsService.get({
      eventId: $stateParams.eventId,
      duplicate: true
    }).$promise;
  }

  newEvent.$inject = ['EventsService'];

  function newEvent(EventsService) {
    return new EventsService();
  }
}());
