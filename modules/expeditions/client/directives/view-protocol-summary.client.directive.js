(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('viewProtocolTeamListSummary', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/view-protocol-team-list-summary.client.view.html',
        scope: {
          team: '='
        }
      };
    });
})();
