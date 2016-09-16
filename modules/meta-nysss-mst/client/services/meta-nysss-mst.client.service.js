(function () {
  'use strict';

  angular
    .module('meta-nysss-mst.services')
    .factory('NysssMstService', NysssMstService);

  NysssMstService.$inject = ['$resource'];

  function NysssMstService($resource) {
    return $resource('api/nysss-mst/:standardId', {
      standardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          select: '@select',
          searchString: '@searchString'
        },
        isArray: true
      }
    });
  }
})();
