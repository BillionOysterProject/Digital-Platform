(function () {
  'use strict';

  angular
    .module('meta-ngss-cross-cutting-concepts.services')
    .factory('NgssCrossCuttingConceptsService', NgssCrossCuttingConceptsService);

  NgssCrossCuttingConceptsService.$inject = ['$resource'];

  function NgssCrossCuttingConceptsService($resource) {
    return $resource('api/ngss-cross-cutting-concepts/:standardId', {
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
