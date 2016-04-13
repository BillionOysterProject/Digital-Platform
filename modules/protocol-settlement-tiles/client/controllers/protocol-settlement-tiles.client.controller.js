(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .controller('ProtocolSettlementTilesController', ProtocolSettlementTilesController);

  ProtocolSettlementTilesController.$inject = ['$scope', '$state', 'Authentication', '$stateParams',
  'ProtocolSettlementTilesService', 'FileUploader'];

  function ProtocolSettlementTilesController($scope, $state, Authentication, $stateParams,
    ProtocolSettlementTilesService, FileUploader) {
    var st = this;

    st.tileCount = 4;
    st.gridCount = 25;

    var setupSettlementTileGrid = function() {
      var grids = [];
      for (var j = 0; j < st.gridCount; j++) {
        grids.push({ });
      }

      if (!st.protocolSettleTiles.settlementTiles) {
        st.protocolSettleTiles = {
          settlementTiles: []
        };
      }

      var totalToAdd = st.tileCount - st.protocolSettleTiles.settlementTiles.length;
      for (var i = 0; i < totalToAdd; i++) {
        st.protocolSettleTiles.settlementTiles.push({
          grids: angular.copy(grids)
        });
      }
    };

    // Set up Protocol Settlement Tiles
    st.protocolSettleTiles = {};
    if ($stateParams.protocolSettleTileId) {
      ProtocolSettlementTilesService.get({
        settlementTileId: $stateParams.protocolSettleTileId
      }, function(data) {
        st.protocolSettleTiles = data;
      });
    } else if ($scope.protocolSettleTiles) {
      st.protocolSettleTiles = $scope.protocolSettleTiles;
      if (!st.protocolSettleTiles.settlementTiles || st.protocolSettleTiles.settlementTiles.length < st.tileCount) {
        setupSettlementTileGrid();
      }
    } else {
      st.protocolSettleTiles = new ProtocolSettlementTilesService();
      setupSettlementTileGrid();
    }

    st.authentication = Authentication;
    st.error = null;
    st.form = {};

    st.settlementTilePhotoUploaders = [];

    for (var k = 0; k < st.tileCount; k++) {
      st.settlementTilePhotoUploaders.push(new FileUploader({ alias: 'newSettlementTilePicture' }));
    }

    // Remove existing protocol settlemen tile
    st.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        st.protocolSettleTiles.$remove($state.go('protocol-settlement-tiles.main'));
      }
    };

    // Save protocol settlement tile
    st.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'st.form.settlementTilesForm');
      }

      var errorMessages = [];
      st.settlementTilesValid = true;
      for (var i = 0; i < st.protocolSettleTiles.settlementTiles.length; i++) {
        var tile = st.protocolSettleTiles.settlementTiles[i];

        if (!tile.tilePhoto || !tile.tilePhoto.path || tile.tilePhoto.path === '') {
          errorMessages.push('Photo is requires for Settlement Tile #' + i+1);
          st.settlementTilesValid = false;
        }

        if (tile.grids.length !== st.gridCount) {
          st.settlementTilesValid = false;
        }

        for (var j = 0; j < tile.grids.length; j++) {
          var grid = tile.grids[j];
          if (!grid.organism) {
            st.settlementTilesValid = false;
            errorMessages.push('Grid ' + (j+1) + ' on Settlement Tile #' + (i+1) + ' is missing an dominate organism');
          }
        }
      }

      if (!st.settlementTilesValid) {
        if (errorMessages.length > 0) {
          st.error = errorMessages.join();
        }
        $scope.$broadcast('show-errors-check-validity', 'st.form.settlementTilesForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (st.protocolSettleTiles._id) {
        st.protocolSettleTiles.$update(successCallback, errorCallback);
      } else {
        st.protocolSettleTiles.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var settlementTileId = res._id;

        function goToView(settlementTileId) {
          $state.go('protocol-settlement-tiles.view', {
            protocolSettleTileId: settlementTileId
          });
        }

        function uploadAllSettlementTilePhotos(settlementTileId, tilePhotosSuccessCallback, tilePhotosErrorCallback) {
          function uploadSettlementTilePhoto(settlementTileId, index, tilePhotoSuccessCallback, tilePhotoErrorCallback) {
            if (index < st.settlementTilePhotoUploaders.length && st.settlementTilePhotoUploaders[index]) {
              var uploader = st.settlementTilePhotoUploaders[index];
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploadSettlementTilePhoto(settlementTileId, index+1, tilePhotoSuccessCallback, tilePhotoErrorCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, header) {
                  st.settlementTiles.settlementTiles[index].tilePhoto.error = response.message;
                  tilePhotoErrorCallback(index);
                };

                uploader.onBeforeUploadItem = function(item) {
                  item.url = 'api/protocol-settlement-tiles/' + settlementTileId + '/index/' + index + '/upload-tile-photo';
                };
                uploader.uploadAll();
              } else {
                uploadSettlementTilePhoto(settlementTileId, index+1, tilePhotoSuccessCallback, tilePhotoErrorCallback);
              }
            } else {
              tilePhotoSuccessCallback();
            }
          }

          uploadSettlementTilePhoto(settlementTileId, 0, function() {
            tilePhotosSuccessCallback();
          }, function(index) {
            tilePhotosErrorCallback('Error uploading photo for Settlement Tile #' + (index+1));
          });
        }

        uploadAllSettlementTilePhotos(settlementTileId, function() {
          goToView(settlementTileId);
        }, function(errorMessage) {
          delete st.settlementTiles._id;
          st.error = errorMessage;
        });
      }

      function errorCallback(res) {
        st.error = res.data.message;
      }
    };

    st.cancel = function() {
      $state.go('protocol-settlement-tiles.main');
    };

    st.openSettlementTileForm = function(index) {
      var content = angular.element('#modal-settlementtile'+index);
      st.settlementTile = angular.copy(st.protocolSettlementTiles.settlementTiles[index]);
      content.modal('show');
    };

    st.saveSettlementTileForm = function(settlementTile, index, isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'st.form.settlementTilesForm');
        return false;
      } else {
        angular.element('#modal-settlementtile'+index).modal('hide');
        st.protocolSettlementTiles.settlementTiles[index] = settlementTile;
      }
    };

    st.cancelSettlementTileForm = function(index) {
      angular.element('#modal-settlementtile'+index).modal('hide');
      st.substrate = {};
    };
  }
})();
