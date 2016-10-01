// Meta bodies of waters service used to communicate Meta bodies of waters REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-bodies-of-water.services')
    .factory('BodiesOfWaterService', BodiesOfWaterService);

  BodiesOfWaterService.$inject = ['$resource'];

  function BodiesOfWaterService($resource) {
    return $resource('api/bodies-of-water/:bodyOfWaterId', {
      bodyOfWaterId: '@_id'
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
