(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsController', RestorationStationsController);

  RestorationStationsController.$inject = ['$scope', '$http','$timeout', 'lodash', 'FileUploader',
    'BodiesOfWaterService', 'BoroughsCountiesService', 'ShorelineTypesService', 'SiteCoordinatorsService',
    'PropertyOwnersService', 'ExpeditionViewHelper', 'RestorationStationsService'];

  function RestorationStationsController($scope, $http, $timeout, lodash, FileUploader,
  BodiesOfWaterService, BoroughsCountiesService, ShorelineTypesService, SiteCoordinatorsService,
  PropertyOwnersService, ExpeditionViewHelper, RestorationStationsService) {
    var checkRole = ExpeditionViewHelper.checkRole;
    $scope.isAdmin = checkRole('admin');
    $scope.isTeamLead = checkRole('team lead');
    $scope.loaded = false;
    $scope.loading = false;

    $scope.canGeocode = true;
    $scope.canMoveMarker = true;
    $scope.showMarker = true;
    $scope.canClickMapToAddMarker = true;

    $scope.mapControls = {};
    $scope.mapClick = function(e){
    };
    $scope.markerDragEnd = function(location){
    };
    if (!$scope.mapPoints && $scope.station) {
      $scope.mapPoints = [{
        lat: $scope.station.latitude,
        lng: $scope.station.longitude,
        icon: {
          icon: 'glyphicon-map-marker',
          prefix: 'glyphicon',
          markerColor: 'blue'
        },
      }];
    }

    $scope.status = {};

    $scope.stationPhotoUploader = new FileUploader({
      alias: 'stationPhoto'
    });

    $scope.stationStatusPhotoUploader = new FileUploader({
      alias: 'stationStatusPhoto'
    });

    BodiesOfWaterService.query({
    }, function(data) {
      $scope.bodiesOfWater = data;
    });

    BoroughsCountiesService.query({
    }, function(data) {
      $scope.boroughsCounties = data;
    });

    ShorelineTypesService.query({
    }, function(data) {
      $scope.shorelineTypes = data;
    });
    $scope.getShorelineTypes = ExpeditionViewHelper.getShorelineTypes;

    if ($scope.isTeamLead || $scope.isAdmin) {
      SiteCoordinatorsService.query({
      }, function(data) {
        $scope.siteCoordinators = data;
      });

      PropertyOwnersService.query({
      }, function(data) {
        $scope.propertyOwners = data;
      });
    }

    $scope.statuses = [
      { label: 'Active', value: 'Active' },
      { label: 'Damaged', value: 'Damaged' },
      { label: 'Destroyed', value: 'Destroyed' },
      { label: 'Lost', value: 'Lost' },
      { label: 'Unknown', value: 'Unknown' }
    ];

    $scope.load = function(callback) {
      if ($scope.station) {
        RestorationStationsService.get({
          stationId: $scope.station._id
        }, function(data) {
          $scope.station = data;

          $http.get('/api/expeditions/restoration-station', {
            params: { stationId: $scope.station._id }
          })
          .success(function(response) {
            $scope.station.expeditions = response;
            $scope.loading = false;
            $scope.loaded = true;

            // $http.get('/api/restoration-stations/' + $scope.station._id + '/measurement-chart-data')
            // .success(function(response) {
            //   console.log('response', response);
            //
            //   $scope.mortalitySeries = ['Mortality'];
            if (callback) callback();
            // })
            // .error(function(err) {
            //   console.log('err', err);
            // });

          })
          .error(function(err) {
            console.log('err', err);
          });
        });
      } else {
        $scope.loading = false;
        $scope.loaded = true;
      }
    };

    $scope.save = function(isValid) {
      $scope.disableCancel = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.teamMemberForm');
        return false;
      }

      $scope.station.team = {
        '_id': $scope.teamId
      };

      if (lodash.isEmpty($scope.station.siteCoordinator)) {
        $scope.station.siteCoordinator = undefined;
      } else if (!lodash.isEmpty($scope.station.siteCoordinator) && $scope.station.siteCoordinator._id !== '-1') {
        $scope.station.otherSiteCoordinator = {};
      }
      if (lodash.isEmpty($scope.station.propertyOwner)) {
        $scope.station.propertyOwner = undefined;
      } else if (!lodash.isEmpty($scope.station.propertyOwner) && $scope.station.propertyOwner._id !== '-1') {
        $scope.station.otherPropertyOwner = {};
      }

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
          $scope.closeFunction(true);
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

    $scope.updateStatus = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.restorationStationStatusForm');
        return false;
      }

      function uploadStationStatusPhoto(stationId, index, imageSuccessCallback, imageErrorCallback) {
        if ($scope.stationStatusPhotoUploader.queue.length > 0) {
          $scope.stationStatusPhotoUploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.stationStatusPhotoUploader.removeFromQueue(fileItem);
            imageSuccessCallback();
          };

          $scope.stationStatusPhotoUploader.onErrorItem = function (fileItem, response, sttus, headers) {
            imageErrorCallback(response.message);
          };

          $scope.stationStatusPhotoUploader.onBeforeUploadItem = function (item) {
            item.url = 'api/restoration-stations/' + stationId + '/upload-status-image/' + index;
          };
          $scope.stationStatusPhotoUploader.uploadAll();
        } else {
          imageSuccessCallback();
        }
      }

      $http.post('/api/restoration-stations/' + $scope.station._id + '/status-history', {
        status: $scope.status.status,
        description: $scope.status.description
      })
      .success(function(response) {
        $scope.closeFunction();
        $scope.station = response.station;
        var stationId = $scope.station._id;
        var index = response.index;

        if (stationId && index > -1) {
          uploadStationStatusPhoto(stationId, index, function() {
            $http.post('api/restoration-stations/' + $scope.station._id + '/send-status/' + index, {
            })
            .success(function(response) {
              $scope.closeFunction();
            })
            .error(function(errorMessage) {
              console.log('error: ' + errorMessage);
              $scope.error = errorMessage;
            });
          }, function(errorMessage) {
            console.log('error: ' + errorMessage);
            $scope.error = errorMessage;
          });
        } else {
          console.log('Error adding station status');
          $scope.error = 'Error adding station status';
        }
      })
      .error(function(err) {
        console.log('err', err);
        $scope.error = err;
      });
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
