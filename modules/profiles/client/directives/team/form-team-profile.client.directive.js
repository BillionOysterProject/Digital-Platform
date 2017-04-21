(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formTeamProfileModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team/form-team-profile.client.view.html',
        scope: {
          team: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'TeamFormController',
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.organizationSelected = '';

            scope.form.teamProfileForm.$setPristine();
          });
          scope.$watch('team', function(newValue, oldValue) {
            scope.team = newValue;
            scope.editTeam = angular.copy(scope.team);
            scope.teamPhotoURL = (scope.team && scope.team.photo && scope.team.photo.path) ? scope.team.photo.path : '';
          });
        }
      };
    });
})();
