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
        replace: true,
        controller: function($scope, $http) {
          $scope.save = function(isValid) {
            //if ()
          };
        },
        link: function(scope, element, attrs) {

        }
      };
    }]);
})();