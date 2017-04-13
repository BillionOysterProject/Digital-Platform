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
          initial: '=?',
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

          element.bind('show.bs.modal', function() {
            scope.shown = true;
            scope.isCurrentUserAdmin = false;
            scope.isCurrentUserTeamLead = false;
            scope.isCurrentUserUser = false;
            if (!scope.content || (scope.initial && (scope.content !== scope.initial))) {
              scope.content = scope.initial || 'userView';
              scope.$broadcast('userCrudShown', {
                view: scope.initial
              });
            }
          });
          //
          // element.bind('shown.bs.modal', function() {
          //   scope.$broadcast('userCrudShown', {
          //     view: scope.content
          //   });
          // });

          scope.$watch('initial', function(newValue, oldValue) {
            if (scope.shown && (!scope.content || (scope.initial && (scope.content !== scope.initial)))) {
              scope.content = scope.initial = newValue || 'userView';
              scope.$broadcast('userCrudShown', {
                view: scope.initial
              });
            }
          });

          //when modal is hidden, if we were supposed to change state then do it
          element.bind('hidden.bs.modal', function() {
            scope.content = {};
            scope.shown = false;
            if(toGoState) {
              $state.go(toGoState.name, toGoParams);
            }
          });

          scope.$watch('user', function(newValue, oldValue) {
            scope.user = newValue;
          });
        },
      };
    });
})();
