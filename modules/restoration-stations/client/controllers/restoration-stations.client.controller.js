(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsController', RestorationStationsController);

  RestorationStationsController.$inject = ['$scope', '$http','$timeout'];

  function RestorationStationsController($scope, $http, $timeout) {
    $scope.canGeocode = true;
    $scope.canMoveMarker = true;
    $scope.showMarker = true;

    $scope.mapControls = {};

    angular.element(document.querySelector('#modal-station-register')).on('shown.bs.modal', function(){
      $timeout(function() {
        $scope.mapControls.resizeMap();
      });
    });

    $scope.save = function(isValid) {
      console.log('save');
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.teamMemberForm');
        return false;
      }

      if ($scope.station._id) {
        $scope.station.$update(successCallback, errorCallback);
      } else {
        $scope.station.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $scope.saveFunction();
      }

      function errorCallback(res) {
        console.log('error: ' + res.data.message);
        $scope.error = res.data.message;
      }
    };

    // Remove existing Lesson
    $scope.remove = function() {
      $scope.station.$remove();
      $scope.removeFunction();
    };

    $scope.placeSelected = function (place) {
      if (place.location) {
        $scope.mapControls.zoomToLocation(place.location);
        updateCoords(place.location);
      }

    };

    $scope.mapClick = function(e){
      updateCoords(e.latlng);
    };

    $scope.markerDragEnd = function(location){
      updateCoords(location);
    };

    function updateCoords(coords) {
      $scope.station.latitude = coords.lat;
      $scope.station.longitude = coords.lng;
    }
  }
})();
