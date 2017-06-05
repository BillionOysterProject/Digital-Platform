(function () {
  'use strict';

  angular
    .module('profiles.routes')
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
        controller: 'ProfileController',
        controllerAs: 'vm',
        // data: {
        //   pageTitle: 'Events List'
        // }
      })
      .state('profiles.user', {
        url: '/user',
        templateUrl: 'modules/profiles/client/views/user/user.client.view.html',
      })
      .state('profiles.user-view', {
        url: '/user/:userId',
        templateUrl: 'modules/profiles/client/views/user/view-user.client.view.html'
      })
      .state('profiles.admin-users', {
        url: '/users',
        templateUrl: 'modules/profiles/client/views/user/list-users.client.view.html',
        controller: 'UserListController',
        data: {
          pageTitle: 'Users List',
          roles: ['admin','team member','team lead']
        }
      })
      .state('profiles.team', {
        url: '/team',
        templateUrl: 'modules/profiles/client/views/team/team.client.view.html',
        controller: 'TeamProfileListController',
        controllerAs: 'vm'
      })
      .state('profiles.team-view', {
        url: '/team/:teamId',
        templateUrl: 'modules/profiles/client/views/team/view-team.client.view.html',
        controller: 'TeamProfileController',
        controllerAs: 'vm',
      })
      .state('profiles.organization', {
        url: '/organization',
        templateUrl: 'modules/profiles/client/views/organization/organization.client.view.html',
        controller: 'OrganizationProfileListController',
        controllerAs: 'vm'
      })
      .state('profiles.organization-view', {
        url: '/organization/:schoolOrgId',
        templateUrl: 'modules/profiles/client/views/organization/view-organization.client.view.html',
        controller: 'OrganizationProfileController',
        controllerAs: 'vm',
      });
  }

  getOrganization.$inject = ['$stateParams', 'SchoolOrganizationsService'];

  function getOrganization($stateParams, SchoolOrganizationsService) {
    return SchoolOrganizationsService.get({
      schoolOrgId: $stateParams.schoolOrgId
    }).$promise;
  }

  getTeam.$inject = ['$stateParams', 'TeamsService'];

  function getTeam($stateParams, TeamsService) {
    return TeamsService.get({
      teamId: $stateParams.teamId
    }).$promise;
  }

  getUser.$inject = ['$stateParams', 'Admin'];

  function getUser($stateParams, Admin) {
    return Admin.get({
      userId: $stateParams.userId
    }).$promise;
  }

  getRestorationStation.$inject = ['$stateParams', 'RestorationStationsService'];

  function getRestorationStation($stateParams, RestorationStationsService) {
    return RestorationStationsService.get({
      stationId: $stateParams.stationId
    }).$promise;
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
