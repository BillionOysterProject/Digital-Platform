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
          });
        });
      }
    }
    
    vm.placeSelected = function (place) {
      if (place.location) {
        vm.mapControls.zoomToLocation(place.location);
        updateCoords(place.location);
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
    
  }
})();
