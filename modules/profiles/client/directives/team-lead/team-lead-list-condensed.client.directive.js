(function() {
  'use strict';

  angular
    .module('teams')
    .directive('teamLeadListCondensed', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-lead/team-lead-list-condensed.client.view.html',
        scope: {
          teamLeads: '='
        }
      };
    });
})();
