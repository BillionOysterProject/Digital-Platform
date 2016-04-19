(function () {
  'use strict';

  angular
    .module('restoration-stations.services')
    .factory('RestorationStationsService', RestorationStationsService);

  RestorationStationsService.$inject = ['$resource'];

  function RestorationStationsService($resource) {
    return $resource('api/restoration-stations/:stationId', {
      stationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
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
