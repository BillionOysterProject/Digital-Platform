(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('formAdminTeamLeadContent', ['$http', 'lodash',
      function($http, lodash) {
        return {
          restrict: 'AE',
          templateUrl: 'modules/profiles/client/views/team-lead/form-admin-team-lead-content.client.view.html',
          scope: {
            user: '=',
            organization: '=',
            organizations: '=?',
            teamLeadType: '=?',
            saveFunction: '=',
            closeFunction: '='
          },
          controller: 'FormAdminUserController',
          link: function(scope, element, attrs) {
            scope.$on('formTeamLead', function() {
            });

            scope.$watch('user', function(newValue, oldValue) {
              scope.user = newValue;
              scope.selectedRole = 'guest';
              if(newValue && newValue.roles && newValue.roles.length > 0) {
                for(var i = 0; i < newValue.roles.length; i++) {
                  var newRole = newValue.roles[i];
                  for(var j = 0; j < scope.roles.length; j++) {
                    var userRole = scope.roles[j].value;
                    if(newRole.toLowerCase() === userRole.toLowerCase()) {
                      scope.selectedRole = userRole;
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
              } else {
                scope.isAdmin = false;
              }
              if (scope.user) {
                scope.isCurrentUserUser = scope.checkCurrentUserIsUser();
                scope.oldOrganization = (scope.user.schoolOrg) ? scope.user.schoolOrg : scope.organization;
                if (scope.oldOrganization && !scope.oldOrganization._id) {
                  scope.user.schoolOrg = {
                    _id: scope.oldOrganization
                  };
                }
              }
            });
          }
        };
      }]);
})();
