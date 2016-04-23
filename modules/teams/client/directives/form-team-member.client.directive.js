(function() {
  'use strict';

  angular
    .module('teams')
    .directive('formTeamMemberModal', ['$http', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/teams/client/views/form-team-member.client.view.html',
        scope: {
          teamMember: '=',
          teams: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        controller: 'TeamMemberController',
        replace: true,
        link: function(scope, element, attrs) {
          
        }
      };
    }]);
})();
