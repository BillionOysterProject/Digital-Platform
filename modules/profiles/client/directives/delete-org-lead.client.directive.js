(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('deleteOrgLeadModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/delete-org-lead.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
