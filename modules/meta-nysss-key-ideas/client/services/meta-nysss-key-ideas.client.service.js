(function () {
  'use strict';

  angular
    .module('meta-nysss-key-ideas.services')
    .factory('NysssKeyIdeasService', NysssKeyIdeasService);

  NysssKeyIdeasService.$inject = ['$resource'];

  function NysssKeyIdeasService($resource) {
    return $resource('api/nysss-key-ideas/:standardId', {
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
