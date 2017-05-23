(function() {
  'use strict';

  angular
    .module('researches')
    .directive('returnResearch', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/researches/client/views/return-research.client.view.html',
        controller: 'ReturnResearchController',
        controllerAs: 'vm',
        scope: {
          research: '=',
          closeFunction: '='
        }
      };
    });
})();
