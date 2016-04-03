(function () {
  'use strict';

  angular
    .module('forms')
    .controller('MapSelectController', MapSelectController);

  MapSelectController.$inject = ['$scope', 'L','$timeout','$http','GoogleGeoCodeService'];

  function MapSelectController($scope, L,$timeout, $http,GoogleGeoCodeService) {
    var vm = this;
    var mapSelectMap;
    vm.placeSelected = null;

    var settings = {
      defaults:{

        attribution: 'Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, ' +
        '<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href=\"http://mapbox.com\">Mapbox</a>',
        center:[40.783435, -73.966249],
        mapUrl:'https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={apikey}',
        mapId:'mapbox.streets',
        key:'pk.eyJ1IjoiaGJvc3RpYyIsImEiOiItazlJbnQ0In0.joIlPakjiZj3rVbgXAPKMQ',
        zoom:10,
        maxZoom: 18
      },
      searchZoom:14,
      initialBounds: { xmin: -119.37, ymin: 23.21, xmax: -69.36, ymax: 51.98 }

    };

    activate();

    function activate(){
      
      $timeout(function() {
        //timeout needed to wait for html to bind to controller so the id can be set dynamically
        mapSelectMap = L.map($scope.mapUniqueId).setView(settings.defaults.center, settings.defaults.zoom);
        L.tileLayer(settings.defaults.mapUrl, {
          maxZoom: 18,
          attribution: settings.defaults.attribution,
          id: settings.defaults.mapId,
          apikey:settings.defaults.key
        }).addTo(mapSelectMap);
        mapSelectMap.scrollWheelZoom.disable();


        mapSelectMap.on('click', function(e){
          //since this event is outside angular world, must call apply so the ui looks for changes
          $scope.$apply(function () {
            updateCoords(e.latlng);
          });
          
        });
        
      });

      if(vm.modalId){
        angular.element(document.querySelector('#'+vm.modalId)).on('shown.bs.modal', function(){
          setTimeout(function() {
            mapSelectMap.invalidateSize();
          });
        });
      }

      $scope.$on('$destroy', function () {
        mapSelectMap.off('click', updateCoords);
        angular.element(document.querySelector('#'+vm.modalId)).unbind('shown.bs.modal');
      });
      
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
    
    vm.selectPlace = function ($item, $model, $label, $event) {
      if ($event.which === 13 || $event.which === 1) {
        zoomToLocation(L.latLng(vm.placeSelected.location.lat, vm.placeSelected.location.lng));
      }

    };


    function updateCoords(coords) {
      vm.latitude = coords.lat;
      vm.longitude = coords.lng;
    }
    
    function zoomToLocation(location){
      mapSelectMap.setView(location, settings.searchZoom);
      updateCoords(location);
    }
    
  }
})();
