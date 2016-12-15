(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('inviteTeamLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/invite-team-lead.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
