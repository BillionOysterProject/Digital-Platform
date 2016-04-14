(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .controller('ProtocolSettlementTilesController', ProtocolSettlementTilesController);

  ProtocolSettlementTilesController.$inject = ['$scope', '$state', '$http', 'Authentication', '$stateParams',
  'ProtocolSettlementTilesService', 'SessileOrganismsService', 'FileUploader'];

  function ProtocolSettlementTilesController($scope, $state, $http, Authentication, $stateParams,
    ProtocolSettlementTilesService, SessileOrganismsService, FileUploader) {
    var st = this;

    st.tileCount = 4;
    st.gridCount = 25;

    var setupSettlementTileGrid = function() {
      if (!st.protocolSettlementTiles.settlementTiles) {
        st.protocolSettlementTiles = {
          settlementTiles: []
        };
      }

      var totalToAdd = st.tileCount - st.protocolSettlementTiles.settlementTiles.length;
      for (var i = 0; i < totalToAdd; i++) {
        st.protocolSettlementTiles.settlementTiles.push({
          grid1: {
            notes: ''
          },
          grid2: {
            notes: ''
          },
          grid3: {
            notes: ''
          },
          grid4: {
            notes: ''
          },
          grid5: {
            notes: ''
          },
          grid6: {
            notes: ''
          },
          grid7: {
            notes: ''
          },
          grid8: {
            notes: ''
          },
          grid9: {
            notes: ''
          },
          grid10: {
            notes: ''
          },
          grid11: {
            notes: ''
          },
          grid12: {
            notes: ''
          },
          grid13: {
            notes: ''
          },
          grid14: {
            notes: ''
          },
          grid15: {
            notes: ''
          },
          grid16: {
            notes: ''
          },
          grid17: {
            notes: ''
          },
          grid18: {
            notes: ''
          },
          grid19: {
            notes: ''
          },
          grid20: {
            notes: ''
          },
          grid21: {
            notes: ''
          },
          grid22: {
            notes: ''
          },
          grid23: {
            notes: ''
          },
          grid24: {
            notes: ''
          },
          grid25: {
            notes: ''
          }
        });
      }
    };

    var tileDone = function(settlementTile) {
      var done = true;
      for (var i = 1; i <= st.gridCount; i++) {
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

    // Set up Protocol Settlement Tiles
    st.protocolSettlementTiles = {};
    if ($stateParams.protocolSettlementTileId) {
      ProtocolSettlementTilesService.get({
        settlementTileId: $stateParams.protocolSettlementTileId
      }, function(data) {
        st.protocolSettlementTiles = data;
        for (var i = 0; i < st.protocolSettlementTiles.settlementTiles.length; i++) {
          st.protocolSettlementTiles.settlementTiles[i].done = tileDone(st.protocolSettlementTiles.settlementTiles[i]);
        }
      });
    } else if ($scope.protocolSettlementTiles) {
      st.protocolSettlementTiles = new ProtocolSettlementTilesService($scope.protocolSettlementTiles);
      if (!st.protocolSettlementTiles.settlementTiles || st.protocolSettlementTiles.settlementTiles.length < st.tileCount) {
        setupSettlementTileGrid();
      }
      console.log('protocolSettlementTiles', st.protocolSettlementTiles);
      for (var j = 0; j < st.protocolSettlementTiles.settlementTiles.length; j++) {
        st.protocolSettlementTiles.settlementTiles[j].done = tileDone(st.protocolSettlementTiles.settlementTiles[j]);
      }
    } else {
      st.protocolSettlementTiles = new ProtocolSettlementTilesService();
      setupSettlementTileGrid();
    }

    st.authentication = Authentication;
    st.error = null;
    st.form = {};

    SessileOrganismsService.query({
    }, function(data) {
      st.sessileOrganisms = data;
      st.sessileOrganisms.push({
        _id: '-1',
        commonName: 'Other (mark in notes)'
      });
    });

    st.settlementTilePhotoUploaders = [];

    for (var k = 0; k < st.tileCount; k++) {
      st.settlementTilePhotoUploaders.push(new FileUploader({ alias: 'newSettlementTilePicture' }));
    }

    // Remove existing protocol settlemen tile
    st.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        st.protocolSettlementTiles.$remove($state.go('protocol-settlement-tiles.main'));
      }
    };

    // Save protocol settlement tile
    st.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'st.form.settlementTilesForm');
      }

      var errorMessages = [];
      st.settlementTilesValid = true;
      for (var i = 0; i < st.protocolSettlementTiles.settlementTiles.length; i++) {
        var tile = st.protocolSettlementTiles.settlementTiles[i];

        if (!tile.tilePhoto || !tile.tilePhoto.path || tile.tilePhoto.path === '') {
          errorMessages.push('Photo is requires for Settlement Tile #' + (i+1));
          st.settlementTilesValid = false;
        }

        for (var j = 1; j <= st.gridCount; j++) {
          var grid = tile['grid'+j];
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
      console.log('protocol', st.protocolSettlementTiles);
      if (st.protocolSettlementTiles._id) {
        st.protocolSettlementTiles.$update(successCallback, errorCallback);
      } else {
        st.protocolSettlementTiles.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var settlementTileId = res._id;

        function goToView(settlementTileId) {
          $state.go('protocol-settlement-tiles.view', {
            protocolSettlementTileId: settlementTileId
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
      st.grids = [];
      var tile = st.protocolSettlementTiles.settlementTiles[index-1];
      for (var i = 1; i <= st.gridCount; i++) {
        console.log('grid'+i+'-organism', tile['grid'+i].organism);
        var organismId = (tile['grid'+i] && tile['grid'+i].organism && tile['grid'+i].organism._id) ?
            tile['grid'+i].organism._id : tile['grid'+i].organism;
        if ((!organismId || organismId === undefined || organismId === null || organismId === '') &&
          tile['grid'+i].notes !== '') {
          organismId = '-1';
        }
        st.grids[i-1] = {
          organismId: organismId,
          notes: tile['grid'+i].notes
        };
        console.log('st.grids', st.grids);
      }
      content.modal('show');
    };

    st.saveSettlementTileForm = function(grids, index, isValid) {
      console.log('settlementTileGrids', grids);
      console.log('index', index);
      angular.element('#modal-settlementtile'+index).modal('hide');

      st.protocolSettlementTiles.settlementTiles[index-1].done =
        tileDone(st.protocolSettlementTiles.settlementTiles[index-1]);
      console.log('st.protocolSettlementTiles', st.protocolSettlementTiles);
      for (var i = 1; i <= grids.length; i++) {
        st.protocolSettlementTiles.settlementTiles[index-1]['grid'+i] = {
          organism: (grids[i-1].organismId !== '-1') ? grids[i-1].organismId : undefined,
          notes: grids[i-1].notes
        };
      }
      st.protocolSettlementTiles.settlementTiles[index-1].done =
        tileDone(st.protocolSettlementTiles.settlementTiles[index-1]);
      console.log('st.protocolSettlementTiles', st.protocolSettlementTiles);
      st.saveOnBlur();
    };

    st.cancelSettlementTileForm = function(index) {
      angular.element('#modal-settlementtile'+index).modal('hide');
    };

    st.saveOnBlur = function() {
      console.log('settlementTile', st.protocolSettlementTiles);
      if (st.protocolSettlementTiles._id) {
        $http.post('/api/protocol-settlement-tiles/' + st.protocolSettlementTiles._id + '/incremental-save',
        st.protocolSettlementTiles)
        .success(function (data, status, headers, config) {
          console.log('saved');
        })
        .error(function (data, status, header, config) {
          st.error = data.message;
        });
      }
    };
  }
})();
