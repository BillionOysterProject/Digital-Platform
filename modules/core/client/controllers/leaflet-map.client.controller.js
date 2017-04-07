(function () {
  'use strict';

  angular
    .module('core')
    .controller('LeafletMapController', LeafletMapController);

  LeafletMapController.$inject = ['$scope', 'L', '$timeout', '$compile'];

  function LeafletMapController($scope, L, $timeout, $compile) {
    var vm = this;
    var mapSelectMap;
    var mapMarker = null;
    var popupScope = null;
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
      mapSelectMap.setView(latlng, settings.searchZoom, { animate: false });
      moveMarker(latlng);
    };

    var panTo = function(location) {
      var latlng = L.latLng(location.lat, location.lng);
      mapSelectMap.panTo(latlng);
      $timeout(function() {
        mapSelectMap.invalidateSize(false);
      });
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
        vm.mapControls.panTo = panTo;
      }

      $timeout(function() {
        //timeout needed to wait for html to bind to controller so the id can be set dynamically
        mapSelectMap = L.map($scope.mapUniqueId).setView(settings.defaults.center, settings.defaults.zoom);
        $scope.mapSelectMap = mapSelectMap;
        L.tileLayer(settings.defaults.mapUrl, {
          maxZoom: 18,
          attribution: settings.defaults.attribution,
          id: settings.defaults.mapId,
          apikey:settings.defaults.key
        }).addTo(mapSelectMap);
        mapSelectMap.scrollWheelZoom.disable();

        if(vm.canClickMapToAddMarker){
          mapSelectMap.on('click', function(e){
            //since this event is outside angular world, must call apply so the ui looks for changes
            $scope.$apply(function () {
              moveMarker(e.latlng);
              if(angular.isFunction(vm.mapClickEvent())) {
                vm.mapClickEvent()(e);
              }
            });
          });
        }

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

          if (vm.canMoveMarker) {
            mapMarker.on('drag', function(e) {
              var latLng = mapMarker.getLatLng();
              if (!mapSelectMap.getBounds().contains(latLng)) {
                panTo(latLng);
              }
            });
          }
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
        if(vm.addPoints && angular.isArray(vm.addPoints) && mapSelectMap &&
          JSON.stringify(oldValue) !== JSON.stringify(newValue)){
          if(vm.addPoints.length > 0){
            loadPoints();
          }
        }
      });

      $scope.refresh = function() {
        mapSelectMap.invalidateSize(false);
      };
    }

    function loadPoints(){
      addPointsGroup.clearLayers();

      for (var i = 0; i < vm.addPoints.length; i++) {
        var marker = new L.marker([vm.addPoints[i].lat,vm.addPoints[i].lng],{ icon:L.AwesomeMarkers.icon(vm.addPoints[i].icon) });

        if(vm.addPoints[i].info && vm.addPoints[i].info.html){
          var popup = L.popup({
            minWidth:100,
            closeButton:true
          });

          var html = vm.addPoints[i].info.html;
          popupScope = $scope.$new(true);

          angular.forEach(vm.addPoints[i].info, definePopupScope);

          var linkFn = $compile(html);
          var content = linkFn(popupScope);

          popup.setContent(content[0]);
          marker.bindPopup(popup);

          addPointsGroup.addLayer(marker);
        } else {
          addPointsGroup.addLayer(marker);
        }

      }
      mapSelectMap.addLayer(addPointsGroup);
      mapSelectMap.fitBounds(addPointsGroup.getBounds());
      zoomOut();
    }

    function definePopupScope(value,key){
      popupScope[key] = value;
    }

  }
})();
