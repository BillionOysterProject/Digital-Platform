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
      query: {
        method: 'GET',
        params: {
          byOwner: '@byOwner',
          byMember: '@byMember',
          teamId: '@teamId',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
