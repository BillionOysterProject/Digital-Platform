(function() {
  'use strict';

  angular
    .module('researches')
    .directive('publishResearch', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/researches/client/views/publish-research.client.view.html',
        controller: 'PublishResearchController',
        controllerAs: 'vm',
        scope: {
          research: '=',
          closeFunction: '='
        }
      };
    });
})();
