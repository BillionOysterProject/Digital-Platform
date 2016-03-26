(function () {
  'use strict';

  angular
    .module('teams.services')
    .factory('TeamMembersService', TeamMembersService);

  TeamMembersService.$inject = ['$resource'];

  function TeamMembersService($resource) {
    return $resource('api/teams/members', {
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          byOwner: '@byOwner',
          teamId: '@teamId',
          searchString: '@searchString',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
