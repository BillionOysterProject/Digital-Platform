(function() {
  'use strict';

  angular
    .module('teams')
    .directive('teamLeadListCondensed', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/team-lead-list-condensed.client.view.html',
        scope: {
          teamLeads: '='
        }
      };
    });
})();
