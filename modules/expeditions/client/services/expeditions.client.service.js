(function () {
  'use strict';

  angular
    .module('expeditions.services')
    .factory('ExpeditionsService', ExpeditionsService);

  ExpeditionsService.$inject = ['$resource'];

  function ExpeditionsService($resource) {
    return $resource('api/expeditions/:expeditionId', {
      expeditionId: '@_id',
      full: '@full'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          teamId: '@teamId',
          station: '@station',
          organization: '@organization',
          dateRange: '@dateRange',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
