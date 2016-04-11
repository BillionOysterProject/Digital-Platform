(function () {
  'use strict';

  angular
    .module('team-requests.services')
    .factory('TeamRequestsService', TeamRequestsService);

  TeamRequestsService.$inject = ['$resource'];

  function TeamRequestsService($resource) {
    return $resource('api/team-requests/:teamRequestId', {
      teamRequestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          byOwner: '@byOwner',
          byMember: '@byMember',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
