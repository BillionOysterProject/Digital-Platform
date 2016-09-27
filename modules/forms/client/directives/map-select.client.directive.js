(function() {
  'use strict';

  angular
    .module('forms')
    .directive('mapSelect', ['$timeout', 'L',function($timeout, L) {
      var mapUniqueId = 1;

      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/map-select.client.view.html',
        scope: {
          canClickMapToAddMarker:'=',
          canGeocode:'=',
          canMoveMarker:'=',
          latitude: '=',
          longitude: '=',
          address: '=',
          modalId:'@',
          showMarker:'=',
          dismissFunction: '='
        },

        link: function(scope, elem, attrs) {
          scope.mapUniqueId = 'forms-map-select-map' + mapUniqueId++;

        },
        controller: 'MapSelectController',
        controllerAs: 'vm',
        bindToController: true,
        require: [],
        replace: true
      };
    }]);
})();
