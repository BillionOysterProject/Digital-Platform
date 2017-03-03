(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formTeamMemberContent', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-member/form-team-member-content.client.view.html',
        scope: {
          teamMember: '=',
          team: '=',
          organization: '=',
          closeFunction: '='
        },
        controller: 'TeamMemberController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.form.teamMemberForm.$setSubmitted(false);
            scope.form.teamMemberForm.$setPristine();
            scope.error = null;
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
    });
})();
