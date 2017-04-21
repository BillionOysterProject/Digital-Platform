(function() {
  'use strict';

  angular
    .module('school-orgs')
    .directive('orgLeadListCondensed', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/organization-lead/org-lead-list-condensed.client.view.html',
        scope: {
          orgLeads: '='
        }
      };
    });
})();
