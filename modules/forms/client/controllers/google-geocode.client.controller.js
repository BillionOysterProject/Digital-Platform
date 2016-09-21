(function () {
  'use strict';

  angular
    .module('forms')
    .controller('GoogleGeocodeController', GoogleGeocodeController);

  GoogleGeocodeController.$inject = ['$scope','GoogleGeoCodeService'];

  function GoogleGeocodeController($scope,GoogleGeoCodeService) {
    var vm = this;
    vm.selectedPlace = null;

    activate();

    function activate(){
    }

    vm.getLocation = function(val) {
      return GoogleGeoCodeService.query({
        address:val,
        sensor:false
      }).$promise.then(function(data) {
        return data.results.map(function (item) {
          return {
            place:item.formatted_address,
            location:item.geometry.location
          };
        });
      });
    };

    vm.selectPlace = function() {
      if (vm.selectedPlace) {
        vm.placeSelected()(vm.selectedPlace);
      }
    };
  }
})();
