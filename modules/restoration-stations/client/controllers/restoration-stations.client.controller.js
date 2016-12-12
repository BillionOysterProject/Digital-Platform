(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsController', RestorationStationsController);

  RestorationStationsController.$inject = ['$scope', '$http','$timeout', 'FileUploader',
  'BodiesOfWaterService', 'BoroughsCountiesService'];

  function RestorationStationsController($scope, $http, $timeout, FileUploader,
  BodiesOfWaterService, BoroughsCountiesService) {
    $scope.canGeocode = true;
    $scope.canMoveMarker = true;
    $scope.showMarker = true;
    $scope.canClickMapToAddMarker = true;

    $scope.mapControls = {};

    $scope.stationPhotoUploader = new FileUploader({
      alias: 'stationPhoto'
    });

    BodiesOfWaterService.query({
    }, function(data) {
      $scope.bodiesOfWater = data;
    });

    BoroughsCountiesService.query({
    }, function(data) {
      $scope.boroughsCounties = data;
    });

    angular.element(document.querySelector('#modal-station-register')).on('shown.bs.modal', function(){
      $timeout(function() {
        $scope.mapControls.resizeMap();

        $scope.teamId = ($scope.station && $scope.station.team && $scope.station.team._id) ?
          $scope.station.team._id : $scope.station.team;

        $scope.stationPhotoURL = ($scope.station && $scope.station.photo && $scope.station.photo.path) ?
          $scope.station.photo.path : '';
      });
    });

    $scope.save = function(isValid) {
      $scope.disableCancel = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.teamMemberForm');
        return false;
      }

      $scope.station.team = {
        '_id': $scope.teamId
      };

      if ($scope.station.photo) {
        if ($scope.stationPhotoURL) {
          $scope.station.photo.path = $scope.stationPhotoURL;
        } else {
          $scope.station.photo = null;
        }
      }

      if ($scope.station._id) {
        $scope.station.$update(successCallback, errorCallback);
      } else {
        $scope.station.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var stationId = res._id;

        function uploadStationPhoto(stationId, imageSuccessCallback, imageErrorCallback) {
          if ($scope.stationPhotoUploader.queue.length > 0) {
            $scope.stationPhotoUploader.onSuccessItem = function (fileItem, response, status, headers) {
              $scope.stationPhotoUploader.removeFromQueue(fileItem);
              imageSuccessCallback();
            };

            $scope.stationPhotoUploader.onErrorItem = function (fileItem, response, sttus, headers) {
              imageErrorCallback(response.message);
            };

            $scope.stationPhotoUploader.onBeforeUploadItem = function (item) {
              item.url = 'api/restoration-stations/' + stationId + '/upload-image';
            };
            $scope.stationPhotoUploader.uploadAll();
          } else {
            imageSuccessCallback();
          }
        }

        var unsubmitStation = function(errorMessage) {
          delete $scope.station._id;
          $scope.error = errorMessage;
        };

        uploadStationPhoto(stationId, function() {
          $scope.disableCancel = false;
          $scope.saveFunction();
        }, function(errorMessage) {
          $scope.disableCancel = false;
          unsubmitStation(errorMessage);
        });
      }

      function errorCallback(res) {
        console.log('error: ' + res.data.message);
        $scope.error = res.data.message;
      }
    };

    // Remove existing Lesson
    $scope.remove = function() {
      if ($scope.removeFunction) {
        $scope.station.$remove($timeout(function() {
          $scope.removeFunction();
        }));
      }
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
