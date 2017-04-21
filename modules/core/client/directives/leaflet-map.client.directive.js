(function() {
  'use strict';

  angular
    .module('core')
    .directive('leafletMap', [function() {
      var mapUniqueId = 1;

      return {
        restrict: 'AE',
        templateUrl: 'modules/core/client/views/leaflet-map.client.view.html',
        scope: {
          canClickMapToAddMarker:'=',
          canMoveMarker:'=',
          mapControls:'=',
          mapClickEvent:'&',
          markerDragEndEvent:'&',
          showMarker:'=',
          addPoints:'='
        },

        link: function(scope, elem, attrs) {
          scope.mapUniqueId = 'leaflet-map' + mapUniqueId++;

          scope.$on('$viewContentLoaded', function ($evt, data) {
            scope.refresh();
          });
        },
        controller: 'LeafletMapController',
        controllerAs: 'vm',
        bindToController: true,
        replace: true
      };
    }]);
})();
