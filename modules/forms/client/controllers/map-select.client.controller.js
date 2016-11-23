(function () {
  'use strict';

  angular
    .module('forms')
    .controller('MapSelectController', MapSelectController);

  MapSelectController.$inject = ['$timeout'];

  function MapSelectController($timeout) {
    var vm = this;

    vm.mapControls = {};

    activate();

    function activate(){
      if(vm.modalId){
        angular.element(document.querySelector('#'+vm.modalId)).on('shown.bs.modal', function(){
          $timeout(function() {
            vm.mapControls.resizeMap();
            if(vm.latitude !== null && vm.longitude !== null) {
              var initialLocation = {
                lat: vm.latitude,
                lng: vm.longitude
              };
              vm.mapControls.panTo(initialLocation);
              vm.mapControls.moveMarkerToLocation(initialLocation);
            }
          });
        });
      }
    }

    vm.placeSelected = function (place) {
      if (place.location) {
        vm.mapControls.zoomToLocation(place.location);
        updateCoords(place.location);
      }
      if (place.place) {
        updateAddress(place.place);
      }
    };

    vm.mapClick = function(e){
      updateCoords(e.latlng);
    };

    vm.markerDragEnd = function(location){
      updateCoords(location);
    };

    function updateCoords(coords) {
      vm.latitude = coords.lat;
      vm.longitude = coords.lng;
    }

    function updateAddress(address) {
      vm.address = address;
    }
  }
})();
