(function () {
  'use strict';

  angular
    .module('glossary.services')
    .factory('GlossaryService', GlossaryService);

  GlossaryService.$inject = ['$resource'];

  function GlossaryService($resource) {
    return $resource('api/glossary/:termId', {
      termId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          searchString: '@searchString',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
