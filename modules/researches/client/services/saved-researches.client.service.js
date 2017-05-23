(function() {
  'use strict';

  angular
    .module('researches.services')
    .factory('SavedResearchesService', SavedResearchesService);

  SavedResearchesService.$inject = ['$resource'];

  function SavedResearchesService($resource) {
    return $resource('api/research/favorites', {});
  }
})();
