(function() {
  'use strict';

  angular
    .module('researches')
    .directive('updatedResearchModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/researches/client/views/updated-research.client.view.html',
        scope: {

        }
      };
    });
})();
