(function () {
  'use strict';

  angular
    .module('core')
    .controller('LeafletMapController', LeafletMapController);

  LeafletMapController.$inject = ['$scope', 'L','$timeout'];

  function LeafletMapController($scope, L,$timeout) {
    var vm = this;
    var mapSelectMap;
    var mapMarker = null;
    var addPointsGroup = new L.featureGroup();


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

    var resizeMap = function() {

      mapSelectMap.invalidateSize();
    };
    var moveMarker = function(coords) {
      if(mapMarker){
        mapMarker.setLatLng(coords);
      }

    };

    var zoomToLocation = function(location){
      var latlng = L.latLng(location.lat, location.lng);
      mapSelectMap.setView(latlng, settings.searchZoom);
      moveMarker(latlng);
    };

    var zoomToLevel = function(level){
      mapSelectMap.setZoom(level);
    };

    var zoomOut = function(){
      mapSelectMap.zoomOut();
    };

    var zoomIn = function(){
      mapSelectMap.zoomIn();
    };

    activate();

    function activate(){

      if(vm.mapControls){
        vm.mapControls.resizeMap = resizeMap;
        vm.mapControls.moveMarker = moveMarker;
        vm.mapControls.zoomToLocation = zoomToLocation;
        vm.mapControls.zoomToLevel = zoomToLevel;
        vm.mapControls.zoomOut = zoomOut;
        vm.mapControls.zoomIn = zoomIn;
      }

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
            moveMarker(e.latlng);
            if(angular.isFunction(vm.mapClickEvent())) {
              vm.mapClickEvent()(e);
            }
          });

        });

        if(vm.showMarker){
          mapMarker = L.marker([settings.defaults.center[0], settings.defaults.center[1]],{ draggable:vm.canMoveMarker || false }).addTo(mapSelectMap);

          mapMarker.on('dragend', function(e){
            //since this event is outside angular world, must call apply so the ui looks for changes
            $scope.$apply(function () {
              moveMarker(mapMarker.getLatLng());
              if(angular.isFunction(vm.markerDragEndEvent())){
                vm.markerDragEndEvent()(mapMarker.getLatLng());
              }
            });

          });
        }

        if(vm.addPoints && angular.isArray(vm.addPoints)){
          if(vm.addPoints.length > 0){
            loadPoints();
          }
        }


      });

      $scope.$on('$destroy', function () {
        mapSelectMap.off('click');
        if(mapMarker){
          mapMarker.off('dragend');
        }

        angular.element(document.querySelector('#'+vm.modalId)).unbind('shown.bs.modal');
      });

      $scope.$watch('vm.addPoints', function(oldValue, newValue) {
        if(vm.addPoints && angular.isArray(vm.addPoints)){
          if(vm.addPoints.length > 0){
            loadPoints();
          }
        }
      });

    }

    function loadPoints(){

      addPointsGroup.clearLayers();

      for (var i = 0; i < vm.addPoints.length; i++) {
        var marker = new L.marker([vm.addPoints[i].lat,vm.addPoints[i].lng],{ icon:L.AwesomeMarkers.icon(vm.addPoints[i].icon) });

        addPointsGroup.addLayer(marker);


      }
      mapSelectMap.addLayer(addPointsGroup);
      mapSelectMap.fitBounds(addPointsGroup.getBounds());
      zoomOut();


    }
  }
})();
