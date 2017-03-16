(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('formRestorationStationStatusContent', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/restoration-stations/client/views/form-restoration-station-status-content.client.view.html',
        scope: {
          station: '=',
          closeFunction: '='
        },
        link: function(scope, element, attrs) {
          scope.$watch('station', function(newValue, oldValue) {
            scope.station = newValue;
          });
        },
        controller: 'RestorationStationsController',
      };
    });
})();
