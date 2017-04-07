(function () {
  'use strict';

  angular
    .module('forms')
    .controller('MapSelectController', MapSelectController);

  MapSelectController.$inject = ['$timeout', '$scope'];

  function MapSelectController($timeout, $scope) {
    $scope.mapControls = {};

    $scope.activate = function() {
      $timeout(function() {
        $scope.mapControls.resizeMap();
        if($scope.latitude !== undefined && $scope.latitude !== null &&
           $scope.longitude !== undefined && $scope.longitude !== null) {
          var location = {
            lat: $scope.latitude,
            lng: $scope.longitude
          };
          $scope.mapControls.zoomToLocation(location);
        }
      });
    };

    $scope.placeSelected = function (place) {
      if (place.location) {
        $scope.mapControls.zoomToLocation(place.location);
        updateCoords(place.location);
      }
      if (place.place) {
        updateAddress(place.place);
      }
    };

    $scope.mapClick = function(e){
      updateCoords(e.latlng);
    };

    $scope.markerDragEnd = function(location){
      updateCoords(location);
    };

    function updateCoords(coords) {
      $scope.latitude = coords.lat;
      $scope.longitude = coords.lng;
      $scope.mapControls.resizeMap();
      $scope.mapControls.zoomToLocation({
        lat: $scope.latitude,
        lng: $scope.longitude
      });
    }

    function updateAddress(address) {
      $scope.address = address;
    }
  }
})();
