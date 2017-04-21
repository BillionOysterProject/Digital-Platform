(function () {
  'use strict';

  angular
    .module('teams.services')
    .factory('TeamsService', TeamsService);

  TeamsService.$inject = ['$resource'];

  function TeamsService($resource) {
    return $resource('api/teams/:teamId', {
      teamId: '@_id'
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
          byMember: '@byMember',
          userId: '@userId',
          teamId: '@teamId',
          orgId: '@orgId',
          withMembers: '@withMembers',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
