(function() {
  'use strict';

  angular
    .module('forms')
    .directive('viewPermissions', function(lodash, Authentication) {
      return {
        restrict: 'A',
        scope: true,
        replace: true,
        link: function(scope, element, attrs) {
          var authentication = Authentication;
          var hasRole = function(role) {
            var index = lodash.findIndex(authentication.user.roles, function(o) {
              return o === role;
            });
            return (index > -1) ? true : false;
          };
          var roles = lodash.split(attrs.viewPermissions, ',');

          var visible = false;
          for (var i = 0; i < roles.length; i++) {
            if (hasRole(roles[i])) {
              visible = true;
              break;
            }
          }
          if (visible) {
            element.addClass('ng-show');
          } else {
            element.addClass('ng-hide');
          }
        }
      };
    });
})();
