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
            cancelFunction: '=',
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
              if(toGoState) {
                $state.go(toGoState.name, toGoParams);
              }
            });

            element.bind('show.bs.modal', function() {
              scope.content = scope.initial || 'orsView';
            });

            element.bind('shown.bs.modal', function() {
              if (scope.content === 'orsView') {
                scope.$broadcast('viewOrsShow');
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

            $scope.openFormRestorationStation = function() {
              $scope.content = 'orsForm';
            };

            $scope.closeFormRestorationStation = function() {
              $scope.$broadcast('viewOrsShow');
              $scope.content = 'orsView';
            };

            $scope.openRestorationStationStatus = function() {
              $scope.$broadcast('stationStatus');
              $scope.content = 'orsStatus';
            };

            $scope.closeRestorationStationStatus = function() {
              $scope.$broadcast('viewOrsShow');
              $scope.content = 'orsView';
            };

            $scope.openTeamLeadView = function(teamLead) {
              $scope.user = teamLead;
              $scope.content = 'teamLeadView';
            };

            $scope.closeTeamLeadView = function() {
              $scope.user = {};
              $scope.$broadcast('viewOrsShow');
              $scope.content = 'orsView';
            };
          }]
        };
      }
    ]);
})();
