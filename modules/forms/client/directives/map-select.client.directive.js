(function() {
  'use strict';

  angular
    .module('forms')
    .directive('mapSelect', ['$timeout', 'L',function($timeout, L) {
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
          elem.bind('shown.bs.modal', function(){
            scope.$broadcast('displayMapSelectContent');
          });
        },
        replace: true
      };
    }]);
})();
