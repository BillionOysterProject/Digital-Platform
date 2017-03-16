(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('viewRestorationStationContent', function($timeout, $parse) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/restoration-stations/client/views/view-restoration-station-content.client.view.html',
        scope: {
          station: '=',
          openOrsForm: '=',
          openOrsStatus: '=',
          openTeamLeadView: '=',
          closeFunction: '='
        },
        link: function(scope, element, attrs) {
          scope.$watch('station', function(newValue, oldValue) {
            scope.station = newValue;

            if (!scope.station.siteCoordinator) {
              scope.station.siteCoordinator = {};
            }

            if (!scope.station.propertyOwner) {
              scope.station.propertyOwner = {};
            }
          });

          scope.$on('viewOrsShow', function(event, data) {
            scope.load(function() {
            });
          });
        },
        controller: 'RestorationStationsController',
      };
    });
})();
