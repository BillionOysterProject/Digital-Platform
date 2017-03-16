(function () {
  'use strict';

  angular
    .module('restoration-stations.services')
    .factory('SiteCoordinatorsService', SiteCoordinatorsService);

  SiteCoordinatorsService.$inject = ['$resource'];

  function SiteCoordinatorsService($resource) {
    return $resource('api/restoration-stations/site-coordinators', {
      siteCoordinatorId: '@_id'
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
