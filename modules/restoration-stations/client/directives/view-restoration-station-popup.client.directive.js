(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('viewRestorationStationPopup', ['$state',
      function($state) {
        return {
          restrict: 'E',
          templateUrl: 'modules/restoration-stations/client/views/view-restoration-station-popup.client.view.html',
          scope: {
            station: '=',
            closeFunction: '=',
            initial: '=?'
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
              scope.shown = false;
              if(toGoState) {
                $state.go(toGoState.name, toGoParams);
              }
              scope.content = null;
            });

            element.bind('show.bs.modal', function() {
              scope.shown = true;
              scope.refresh = false;
              if (!scope.content || (scope.initial && (scope.content !== scope.initial))) {
                scope.content = scope.initial || 'orsView';
                scope.$broadcast(scope.content);
              }
            });

            // element.bind('shown.bs.modal', function() {
            //   if (scope.content === 'orsView') {
            //     scope.$broadcast('viewOrsShow');
            //   } else if (scope.content === 'orsForm') {
            //     scope.$broadcast('orsForm');
            //   }
            // });

            scope.$watch('initial', function(newValue, oldValue) {
              if (scope.shown && (!scope.content || (scope.initial && (scope.content !== scope.initial)))) {
                scope.content = scope.initial = newValue || 'orsView';
                scope.$broadcast(scope.content);
              }
            });

            scope.$watch('station', function(newValue, oldValue) {
              scope.station = newValue;
            });
          },
          controller: ['$scope',
            function ($scope) {
              $scope.content = 'orsView';
              $scope.user = {};

              $scope.openViewRestorationStation = function() {
                $scope.$broadcast('orsView');
                $scope.content = 'orsView';
              };

              $scope.closeViewRestorationStation = function() {
                $scope.closeFunction($scope.refresh);
              };

              $scope.openFormRestorationStation = function() {
                $scope.$broadcast('orsForm');
                $scope.content = 'orsForm';
              };

              $scope.closeFormRestorationStation = function(refresh) {
                console.log('refresh', refresh);
                if ($scope.initial === 'orsForm') {
                  $scope.closeFunction(refresh);
                } else {
                  $scope.refresh = true;
                  $scope.openViewRestorationStation();
                }
              };

              $scope.deleteRestorationStation = function() {
                $scope.closeFunction(true);
              };

              $scope.openRestorationStationStatus = function() {
                $scope.content = 'orsStatus';
                $scope.$broadcast('orsStatus');
              };

              $scope.closeRestorationStationStatus = function(refresh) {
                if ($scope.initial === 'orsStatus') {
                  $scope.closeFunction(refresh);
                } else {
                  $scope.refresh = true;
                  $scope.openViewRestorationStation();
                }
              };

              $scope.openTeamLeadView = function(teamLead) {
                $scope.user = teamLead;
                $scope.content = 'userView';
                $scope.$broadcast('userCrudShown', {
                  view: $scope.content
                });
              };

              $scope.closeTeamLeadView = function(refresh) {
                if ($scope.initial === 'userView') {
                  $scope.closeFunction();
                } else {
                  $scope.user = {};
                  $scope.openViewRestorationStation();
                }
              };
            }]
        };
      }
    ]);
})();
