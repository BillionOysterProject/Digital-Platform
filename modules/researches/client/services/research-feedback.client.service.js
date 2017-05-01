(function() {
  'use strict';

  angular
    .module('researches.services')
    .factory('ResearchFeedbackService', ResearchFeedbackService);

  ResearchFeedbackService.$inject = ['$resource'];

  function ResearchFeedbackService($resource) {
    return $resource('api/research/:researchId/feedback', {
      researchId: '@researchId'
    });
  }
})();
