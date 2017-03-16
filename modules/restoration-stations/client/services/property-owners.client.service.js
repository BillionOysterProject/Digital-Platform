(function () {
  'use strict';

  angular
    .module('restoration-stations.services')
    .factory('PropertyOwnersService', PropertyOwnersService);

  PropertyOwnersService.$inject = ['$resource'];

  function PropertyOwnersService($resource) {
    return $resource('api/restoration-stations/property-owners', {
      propertyOwnerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
