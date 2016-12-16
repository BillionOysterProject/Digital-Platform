(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formTeamProfileModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/form-team-profile.client.view.html',
        scope: {
          team: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'TeamProfileController',
        controllerAs: 'vm',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
