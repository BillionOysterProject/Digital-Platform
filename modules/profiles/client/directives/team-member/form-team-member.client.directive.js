(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formTeamMemberModal', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-member/form-team-member.client.view.html',
        scope: {
          teamMember: '=',
          team: '=',
          organization: '=',
          closeFunction: '='
        },
        replace: true
      };
    }]);
})();
