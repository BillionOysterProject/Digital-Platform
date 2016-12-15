(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('inviteOrgLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/invite-org-lead.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
