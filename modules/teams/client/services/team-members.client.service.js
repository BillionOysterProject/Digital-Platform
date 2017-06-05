(function () {
  'use strict';

  angular
    .module('teams.services')
    .factory('TeamMembersService', TeamMembersService);

  TeamMembersService.$inject = ['$resource'];

  function TeamMembersService($resource) {
    return $resource('api/teams/members/:memberId', {
      memberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      remove: {
        method: 'DELETE'
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

  angular
    .module('teams.services')
    .factory('TeamMembersDeleteService', TeamMembersDeleteService);

  TeamMembersDeleteService.$inject = ['$resource'];

  function TeamMembersDeleteService($resource) {
    return $resource('api/teams/:teamId/members/:memberId', {
      teamId: '@team._id',
      memberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      remove: {
        method: 'DELETE'
      },
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
})();
