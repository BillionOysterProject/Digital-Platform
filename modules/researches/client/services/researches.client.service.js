// Researches service used to communicate Researches REST endpoints
(function () {
  'use strict';

  angular
    .module('researches')
    .factory('ResearchesService', ResearchesService);

  ResearchesService.$inject = ['$resource'];

  function ResearchesService($resource) {
    return $resource('api/research/:researchId', {
      researchId: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'PUT'
      }
    });
  }
}());
