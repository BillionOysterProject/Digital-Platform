(function() {
  'use strict';

  angular
    .module('forms')
    .directive('mapSelectContent', ['$timeout', 'L',function($timeout, L) {
      var mapUniqueId = 1;

      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/map-select-content.client.view.html',
        scope: {
          canClickMapToAddMarker:'=',
          canGeocode:'=',
          canMoveMarker:'=',
          latitude: '=',
          longitude: '=',
          address: '=',
          modalId:'@',
          showMarker:'=',
          latLongRequired:'='
        },
        link: function(scope, elem, attrs) {
          scope.mapUniqueId = 'forms-map-select-map' + mapUniqueId++;
          scope.$on('displayMapSelectContent', function() {
            scope.activate();
          });
        },
        controller: 'MapSelectController',
        replace: true
      };
    }]);
})();
