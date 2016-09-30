// Meta boroughs counties service used to communicate Meta boroughs counties REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-boroughs-counties.services')
    .factory('BoroughsCountiesService', BoroughsCountiesService);

  BoroughsCountiesService.$inject = ['$resource'];

  function BoroughsCountiesService($resource) {
    return $resource('api/boroughs-counties/:boroughCountyId', {
      boroughCountyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          searchString: '@searchString'
        },
        isArray: true
      }
    });
  }
}());
