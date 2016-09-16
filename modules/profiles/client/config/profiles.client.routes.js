(function () {
  'use strict';

  angular
    .module('profiles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('profiles', {
        abstract: true,
        url: '/profiles',
        template: '<ui-view/>'
      })
      .state('profiles.main', {
        url: '',
        templateUrl: 'modules/profiles/client/views/profiles.client.view.html',
        // controller: 'EventsListController',
        // controllerAs: 'vm',
        // data: {
        //   pageTitle: 'Events List'
        // }
      })
      .state('profiles.team-lead', {
        url: '',
        templateUrl: 'modules/profiles/client/views/team-lead.client.view.html',
      })
      .state('profiles.team', {
        url: '',
        templateUrl: 'modules/profiles/client/views/team.client.view.html',
      })
      .state('profiles.organization', {
        url: '',
        templateUrl: 'modules/profiles/client/views/organization.client.view.html',
      })
      .state('profiles.restoration-station', {
        url: '',
        templateUrl: 'modules/profiles/client/views/restoration-station.client.view.html',
      });
  }

  // getEvent.$inject = ['$stateParams', 'EventsService'];
  //
  // function getEvent($stateParams, EventsService) {
  //   // return EventsService.get({
  //   //   eventId: $stateParams.eventId
  //   // }).$promise; //TODO
  //   return new EventsService();
  // }
  //
  // newEvent.$inject = ['EventsService'];
  //
  // function newEvent(EventsService) {
  //   return new EventsService();
  // }
}());
