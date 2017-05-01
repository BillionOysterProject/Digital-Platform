(function() {
  'use strict';

  angular
    .module('researches')
    .directive('viewResearchPoster', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/researches/client/views/view-research-poster.client.view.html',
        scope: {
          research: '=',
          headerImage: '=',
          created: '@'
        }
      };
    });
})();
