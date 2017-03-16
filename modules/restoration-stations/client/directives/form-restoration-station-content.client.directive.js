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
            }
          });

        }
      };
    });
})();
