(function () {
  'use strict';

  angular
    .module('forms')
    .controller('MapSelectController', MapSelectController);

  MapSelectController.$inject = ['$scope', 'L','$timeout'];

  function MapSelectController($scope, L,$timeout) {
    var vm = this;
    var mapSelectMap;

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


        mapSelectMap.on('click', updateCoords);
        
      });

      if(vm.modalId){
        $('#'+vm.modalId).on('shown.bs.modal', function(){
          setTimeout(function() {
            mapSelectMap.invalidateSize();
          });
        });
      }

      $scope.$on('$destroy', function () {
        map.off('click', updateCoords);
        $('#'+vm.modalId).unbind('shown.bs.modal');
      });
      
    }

    function updateCoords(e) {
      //since this event is outside angular world, must call apply so the ui looks for changes
      $scope.$apply(function () {
        vm.latitude = e.latlng.lat;
        vm.longitude = e.latlng.lng;
        
      });
    }
    
  }
})();
