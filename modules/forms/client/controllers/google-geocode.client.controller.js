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
        console.log('address', data);
        return data.results.map(function (item) {
          return {
            place:item.formatted_address,
            location:item.geometry.location
          };
        });
      });
    };

    vm.selectPlace = function ($item, $model, $label, $event) {
      if ($event.which === 13 || $event.which === 1) {
        vm.placeSelected()(vm.selectedPlace);

      }

    };
  }
})();
