(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .controller('ProtocolSettlementTilesController', ProtocolSettlementTilesController);

  ProtocolSettlementTilesController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
    'lodash', 'ProtocolSettlementTilesService', 'SessileOrganismsService'];

  function ProtocolSettlementTilesController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    lodash, ProtocolSettlementTilesService, SessileOrganismsService) {

    // Check to see if the settlement tile has been added
    $scope.tileStarted = function(settlementTile) {
      var started = false;
      for (var i = 1; i <= $scope.gridCount; i++) {
        if (settlementTile['grid'+i] && settlementTile['grid'+i].organism &&
          settlementTile['grid'+i].organism !== undefined && settlementTile['grid'+i].organism !== '' &&
          settlementTile['grid'+i].organism !== null) {
          started = true;
        }
      }
      return started;
    };

    // Check to see if the settlement tile is finished
    var tileDone = function(settlementTile) {
      var done = true;
      if (!settlementTile.tilePhoto || !settlementTile.tilePhoto.path || settlementTile.tilePhoto.path === '') {
        done = false;
      }

      for (var i = 1; i <= $scope.gridCount; i++) {
        if (!settlementTile['grid'+i] ||
          ((!settlementTile['grid'+i].organism || settlementTile['grid'+i].organism === undefined ||
          settlementTile['grid'+i].organism === '' || settlementTile['grid'+i].organism === null) &&
          (!settlementTile['grid'+i].notes ||
          settlementTile['grid'+i].notes === undefined || settlementTile['grid'+i].notes === ''))) {
          done = false;
        }
      }
      return done;
    };

    // Set up settlement tiles
    var setupTiles = function() {
      for (var i = 0; i < $scope.settlementTiles.settlementTiles.length; i++) {
        $scope.settlementTiles.settlementTiles[i].done = tileDone($scope.settlementTiles.settlementTiles[i]);
        $scope.settlementTiles.settlementTiles[i].imageUrl = ($scope.settlementTiles.settlementTiles[i].tilePhoto) ?
          $scope.settlementTiles.settlementTiles[i].tilePhoto.path : '';
      }
    };

    // Set up the grids in the settlement tiles
    var setupSettlementTileGrid = function() {
      if (!$scope.settlementTiles.settlementTiles) {
        $scope.settlementTiles = {
          settlementTiles: []
        };
      }

      var totalToAdd = $scope.tileCount - $scope.settlementTiles.settlementTiles.length;
      for (var i = 0; i < totalToAdd; i++) {
        $scope.settlementTiles.settlementTiles.push({
          grid1:  { notes: '' },
          grid2:  { notes: '' },
          grid3:  { notes: '' },
          grid4:  { notes: '' },
          grid5:  { notes: '' },
          grid6:  { notes: '' },
          grid7:  { notes: '' },
          grid8:  { notes: '' },
          grid9:  { notes: '' },
          grid10: { notes: '' },
          grid11: { notes: '' },
          grid12: { notes: '' },
          grid13: { notes: '' },
          grid14: { notes: '' },
          grid15: { notes: '' },
          grid16: { notes: '' },
          grid17: { notes: '' },
          grid18: { notes: '' },
          grid19: { notes: '' },
          grid20: { notes: '' },
          grid21: { notes: '' },
          grid22: { notes: '' },
          grid23: { notes: '' },
          grid24: { notes: '' },
          grid25: { notes: '' }
        });
      }
      $http.put('/api/protocol-settlement-tiles/' + $scope.settlementTiles._id,
        $scope.settlementTiles)
        .success(function (data, status, headers, config) {
        })
        .error(function (data, status, header, config) {
        });
    };

    if ($scope.settlementTiles) {
      // Set up initial values
      if (!$scope.settlementTiles.settlementTiles || $scope.settlementTiles.settlementTiles.length < $scope.tileCount) {
        setupSettlementTileGrid();
      }
      $scope.settlementTiles.collectionTime = moment($scope.settlementTiles.collectionTime).startOf('minute').toDate();
      for (var i = 0; i < $scope.settlementTiles.settlementTiles.length; i++) {
        var tile = $scope.settlementTiles.settlementTiles[i];
        tile.imageUrl = (tile.tilePhoto && tile.tilePhoto.path) ? tile.tilePhoto.path : '';
      }
    }

    // Get the values for the dropdowns
    SessileOrganismsService.query({
    }, function(data) {
      $scope.sessileOrganisms = data;
      $scope.sessileOrganisms.push({
        _id: '-1',
        commonName: 'Other (mark in notes)'
      });
    });

    $scope.getSessileOrganismName = function(value) {
      var index = lodash.findIndex($scope.sessileOrganisms, function(o) {
        return o._id === value;
      });
      return (index > -1) ? $scope.sessileOrganisms[index].commonName : '';
    };

    $scope.getSessileOrganismImage = function(value) {
      var index = lodash.findIndex($scope.sessileOrganisms, function(o) {
        return o._id === value;
      });
      return (index > -1 && $scope.sessileOrganisms[index].image) ? $scope.sessileOrganisms[index].image.path : '';
    };

    $scope.openSettlementTileForm = function(index) {
      $scope.grids = [];
      var tile = $scope.settlementTiles.settlementTiles[index-1];
      for (var i = 1; i <= $scope.gridCount; i++) {
        if (tile['grid'+i]) {
          var organismId = (tile['grid'+i].organism && tile['grid'+i].organism._id) ?
            tile['grid'+i].organism._id : tile['grid'+i].organism;

          if ((!organismId || organismId === undefined || organismId === null || organismId === '') &&
          tile['grid'+i].notes !== '') {
            organismId = '-1';
          }
          $scope.grids[i-1] = {
            organismId: organismId,
            notes: tile['grid'+i].notes
          };

        } else {
          $scope.grids[i-1] = {
            organismId: null,
            notes: null
          };
        }
      }
      angular.element('#modal-settlementtile'+index).modal('show');
    };

    $scope.saveSettlementTileForm = function(grids, index, isValid) {
      angular.element('#modal-settlementtile'+index).modal('hide');
      $timeout(function() {
        for (var i = 1; i <= grids.length; i++) {
          $scope.settlementTiles.settlementTiles[index-1]['grid'+i] = {
            organism: (grids[i-1].organismId !== '-1') ? grids[i-1].organismId : undefined,
            notes: grids[i-1].notes
          };
        }
        $scope.settlementTiles.settlementTiles[index-1].done =
          tileDone($scope.settlementTiles.settlementTiles[index-1]);
      });
    };

    $scope.cancelSettlementTileForm = function(index) {
      angular.element('#modal-settlementtile'+index).modal('hide');
    };

    $scope.saveSettlementTile = function(saveSuccessCallback, saveErrorCallback) {
      if (!$scope.form.settlementTilesForm.$valid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.settlementTilesForm.$valid');
      }

      var errorMessages = [];
      var settlementTilesValid = true;
      // for (var i = 0; i < $scope.settlementTiles.settlementTiles.length; i++) {
      //   var tile = $scope.settlementTiles.settlementTiles[i];
      // }

      var settlementTileId = $scope.settlementTiles._id;

      saveImages(function() {
        save();
      });

      function saveImages(callback) {
        function uploadAllSettlementTilePhotos (settlementTileId, tilePhotosSuccessCallback, tilePhotosErrorCallback) {
          function uploadSettlementTilePhoto(settlementTileId, index, errorCount, uploadSettlementTilePhotoCallback) {
            if (index < $scope.settlementTilePhotoUploaders.length && $scope.settlementTilePhotoUploaders[index]) {
              var uploader = $scope.settlementTilePhotoUploaders[index];
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploader.removeFromQueue(fileItem);
                  $scope.finishedSaving += 4;
                  uploadSettlementTilePhoto(settlementTileId, index+1, errorCount, uploadSettlementTilePhotoCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, header) {
                  $scope.settlementTiles.settlementTiles[index].tilePhoto.error = response.message;
                  errorCount++;
                  $scope.finishedSaving += 4;
                  uploadSettlementTilePhoto(settlementTileId, index+1, errorCount, uploadSettlementTilePhotoCallback);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-settlement-tiles/' + settlementTileId + '/index/' + index + '/upload-tile-photo';
                  $scope.savingStatus = 'Saving Settlement Tiles: Uploading photo for Settlement Tile ' + (index+1);
                };
                uploader.uploadAll();
              } else {
                uploadSettlementTilePhoto(settlementTileId, index+1, errorCount, uploadSettlementTilePhotoCallback);
              }
            } else {
              uploadSettlementTilePhotoCallback(errorCount);
            }
          }

          uploadSettlementTilePhoto(settlementTileId, 0, 0, function(errorCount) {
            if (errorCount) {
              tilePhotosErrorCallback('Error uploading photo for Settlement Tiles');
            } else {
              tilePhotosSuccessCallback();
            }
          });
        }

        uploadAllSettlementTilePhotos(settlementTileId, function() {
          var updatedProtocol = ProtocolSettlementTilesService.get({
            settlementTileId: $scope.settlementTiles._id
          }, function(data) {
            if (data.settlementTiles) {
              var tiles = data.settlementTiles;
              for (var i = 0; i < tiles.length; i++) {
                if (tiles[i].tilePhoto) {
                  $scope.settlementTiles.settlementTiles[i].tilePhoto = tiles[i].tilePhoto;
                  $scope.settlementTiles.settlementTiles[i].imageUrl = ($scope.settlementTiles.settlementTiles[i].tilePhoto &&
                    $scope.settlementTiles.settlementTiles[i].tilePhoto.path) ?
                    $scope.settlementTiles.settlementTiles[i].tilePhoto.path : '';
                }
              }
            }
            callback();
          });
        }, function(errorMessage) {
          $scope.settlementTilesErrors = errorMessage;
          callback();
        });
      }

      function save() {
        $scope.savingStatus = 'Saving Settlement Tiles';
        $http.put('/api/protocol-settlement-tiles/' + settlementTileId,
          $scope.settlementTiles)
          .success(function (data, status, headers, config) {
            if (data.errors) {
              $scope.form.settlementTilesForm.$setSubmitted(true);
              errorCallback(data.errors);
            } else {
              $scope.settlementTilesErrors = null;
              successCallback();
            }
          })
          .error(function (data, status, header, config) {
            $scope.form.settlementTilesForm.$setSubmitted(true);
            errorCallback(data.message);
          });
      }

      function successCallback() {
        $scope.settlementTilesErrors = null;
        saveSuccessCallback();
      }

      function errorCallback(errorMessage) {
        if ($scope.settlementTilesErrors && $scope.settlementTilesErrors !== '') {
          $scope.settlementTilesErrors += '\n' + errorMessage;
        } else {
          $scope.settlementTilesErrors = errorMessage;
        }
        saveErrorCallback();
      }
    };

    $scope.validateSettlementTile = function(validateSuccessCallback, validateErrorCallback) {
      if ($scope.settlementTiles && $scope.settlementTiles._id) {
        $http.post('/api/protocol-settlement-tiles/' + $scope.settlementTiles._id + '/validate',
          $scope.settlementTiles)
          .success(function (data, status, headers, config) {
            if (data.errors) {
              $scope.form.settlementTilesForm.$setSubmitted(true);
              errorCallback(data.errors);
            } else {
              successCallback();
            }
          })
          .error(function (data, status, header, config) {
            $scope.form.settlementTilesForm.$setSubmitted(true);
            errorCallback(data.message);
          });
      }

      function successCallback() {
        $scope.settlementTilesErrors = null;
        validateSuccessCallback();
      }

      function errorCallback(errorMessage) {
        $scope.settlementTilesErrors = errorMessage;
        validateErrorCallback();
      }
    };
  }
})();
