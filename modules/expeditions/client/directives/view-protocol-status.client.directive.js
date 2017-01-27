(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('viewProtocolStatus', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/view-protocol-status.client.view.html',
        scope: {
          status: '@',
          isTeamLead: '@',
          isTeamMember: '@',
          isAdmin: '@'
        }
      };
    });
})();
