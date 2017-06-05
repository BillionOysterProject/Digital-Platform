(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('viewRestorationStationContent', function($timeout, $parse, lodash) {
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

            if (scope.station && !scope.station.siteCoordinator && lodash.isEmpty(scope.station.otherSiteCoordinator)) {
              scope.station.siteCoordinator = {};
            } else if (scope.station && lodash.isEmpty(scope.station.siteCoordinator) &&
              scope.station.otherSiteCoordinator && !lodash.isEmpty(scope.station.otherSiteCoordinator)) {
              scope.station.siteCoordinator = { _id: '-1' };
              scope.station.siteCoordinator.displayName = scope.station.otherSiteCoordinator.name;
              scope.station.siteCoordinator.email = scope.station.otherSiteCoordinator.email;
            }

            if (scope.station && !scope.station.propertyOwner && lodash.isEmpty(scope.station.otherPropertyOwner)) {
              scope.station.propertyOwner = {};
            } else if (scope.station && lodash.isEmpty(scope.station.propertyOwner) &&
              scope.station.otherPropertyOwner && !lodash.isEmpty(scope.station.otherPropertyOwner)) {
              scope.station.propertyOwner = { _id: '-1' };
              scope.station.propertyOwner.name = scope.station.otherPropertyOwner.name;
              scope.station.propertyOwner.email = scope.station.otherPropertyOwner.email;
            }

            if (scope.station && scope.station._id && !scope.loading) {
              scope.loaded = false;
              scope.loading = true;
              scope.load(function() {
              });
            }
          });

          scope.$on('orsView', function(event, data) {
            if (scope.station && scope.station._id && !scope.loading) {
              scope.loaded = false;
              scope.loading = true;
              scope.load(function() {
              });
            }
          });
        },
        controller: 'RestorationStationsController',
      };
    });
})();
