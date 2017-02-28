(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formAdminTeamLeadModal', ['$http', 'lodash',
    function($http, lodash) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/team-lead/form-admin-team-lead.client.view.html',
        scope: {
          user: '=',
          organizations: '=',
          teamLeadType: '=',
          saveFunction: '=',
          closeFunction: '='
        },
        replace: true,
        controller: 'FormAdminUserController',
        link: function(scope, element, attrs) {
          scope.$watch('user', function(newValue, oldValue) {
            scope.selectedRole = null;
            if(newValue && newValue.roles && newValue.roles.length) {
              for(var i = 0; i < newValue.roles.length || scope.selectedRole === null; i++) {
                for(var j = 0; j < scope.roles.length; j++) {
                  if(newValue.roles[i].toLowerCase() === scope.roles[j].value.toLowerCase()) {
                    scope.selectedRole = scope.roles[j].value;
                  }
                }
              }

              var checkRole = function(user, role) {
                var index = lodash.findIndex(user.roles, function(r) {
                  return r === role;
                });
                return (index > -1) ? true : false;
              };

              scope.isAdmin = checkRole(newValue, 'admin');
            }
          });
        }
      };
    }]);
})();
