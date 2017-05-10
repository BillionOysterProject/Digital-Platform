(function() {
  'use strict';

  angular
    .module('researches.services')
    .factory('ResearchFeedbackListService', ResearchFeedbackListService);

  ResearchFeedbackListService.$inject = ['$resource'];

  function ResearchFeedbackListService($resource) {
    return $resource('api/research/:researchId/feedback-list', {
      researchId: '@researchId'
    }, {
      'query': {
        method: 'GET',
        params: {},
        isArray: true
      }
    });
  }
})();
