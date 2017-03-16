(function() {
  'use strict';

  angular
    .module('profiles')
    .directive('viewUserModal', function($state) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/profiles/client/views/user/view-user.client.view.html',
        scope: {
          user: '=',
          team: '=?',
          teams: '=?',
          organization: '=?',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          var toGoState = null;
          var toGoParams = null;

          //state change doesn't give the modal time to properly close so
          //the modal background would remain after state change.
          //here, if the modal is showing, prevent state change until the modal is closed
          scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if(element.hasClass('in')) {
              event.preventDefault();
              toGoState = toState;
              toGoParams = toParams;
              element.modal('hide');
            }
          });

          //when modal is hidden, if we were supposed to change state then do it
          element.bind('hidden.bs.modal', function() {
            if(toGoState) {
              $state.go(toGoState.name, toGoParams);
            }
          });
        },
      };
    });
})();
