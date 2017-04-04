(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('formRestorationStationContent', function($timeout) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/restoration-stations/client/views/form-restoration-station-content.client.view.html',
        scope: {
          station: '=',
          mapPoints: '=',
          saveFunction: '=',
          removeFunction: '=',
          cancelFunction: '='
        },
        controller: 'RestorationStationsController',
        replace: true,
        link: function(scope, element, attrs) {
          element.ready(function(){
            scope.form.restorationStationForm.$setSubmitted(false);
            scope.form.restorationStationForm.$setPristine();
          });

          scope.$watch('station', function(newValue, oldValue) {
            if (newValue) {
              scope.station = newValue;

              scope.teamId = (scope.station && scope.station.team && scope.station.team._id) ?
                scope.station.team._id : scope.station.team;

              scope.stationPhotoURL = (scope.station && scope.station.photo && scope.station.photo.path) ?
                scope.station.photo.path : '';

              if (scope.station.otherSiteCoordinator && scope.station.otherSiteCoordinator !== {}) {
                scope.station.siteCoordinator = { _id: '-1' };
                scope.station.siteCoordinator.name = scope.station.otherSiteCoordinator.name;
                scope.station.siteCoordinator.email = scope.station.otherSiteCoordinator.email;
              }
              if (scope.station.otherPropertyOwner && scope.station.otherPropertyOwner !== {}) {
                scope.station.propertyOwner = { _id: '-1' };
                scope.station.propertyOwner.name = scope.station.otherPropertyOwner.name;
                scope.station.propertyOwner.email = scope.station.otherPropertyOwner.email;
              }
            }
          });

        }
      };
    });
})();
