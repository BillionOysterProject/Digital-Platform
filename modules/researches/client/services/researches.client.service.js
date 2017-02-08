// Researches service used to communicate Researches REST endpoints
(function () {
  'use strict';

  angular
    .module('researches')
    .factory('ResearchesService', ResearchesService);

  ResearchesService.$inject = ['$resource'];

  function ResearchesService($resource) {
    return $resource('api/researches/:researchId', {
      researchId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
