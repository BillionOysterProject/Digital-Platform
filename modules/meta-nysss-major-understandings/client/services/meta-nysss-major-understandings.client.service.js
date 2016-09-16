(function () {
  'use strict';

  angular
    .module('meta-nysss-major-understandings.services')
    .factory('NysssMajorUnderstandingsService', NysssMajorUnderstandingsService);

  NysssMajorUnderstandingsService.$inject = ['$resource'];

  function NysssMajorUnderstandingsService($resource) {
    return $resource('api/nysss-major-understandings/:standardId', {
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
