(function() {
  'use strict';

  angular
    .module('researches')
    .directive('savedResearchModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/researches/client/views/saved-research.client.view.html',
        scope: {
          teamLeads: '@',
          isTeamMember: '@'
        }
      };
    });
})();
