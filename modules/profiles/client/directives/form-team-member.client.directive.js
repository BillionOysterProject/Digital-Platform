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
          team: '=',
          organization: '=',
          closeFunction: '='
        },
        controller: 'TeamMemberController',
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.form.teamMemberForm.$setSubmitted(false);
            scope.form.teamMemberForm.$setPristine();
          });
          scope.$watch('team', function(newValue, oldValue) {
            scope.team = newValue;
            scope.newTeam = (newValue && newValue._id) ? newValue._id : newValue;
          });
          scope.$watch('organization', function(newValue, oldValue) {
            scope.organization = newValue;
          });
          scope.$watch('teamMember', function(newValue, oldValue) {
            scope.teamMember = newValue;
          });
        }
      };
    }]);
})();
