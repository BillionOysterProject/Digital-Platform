(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .controller('ProtocolSettlementTilesController', ProtocolSettlementTilesController);

  ProtocolSettlementTilesController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
  'Authentication', 'ProtocolSettlementTilesService', 'SessileOrganismsService', 'TeamMembersService', 'FileUploader'];

  function ProtocolSettlementTilesController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    Authentication, ProtocolSettlementTilesService, SessileOrganismsService, TeamMembersService, FileUploader) {
    var st = this;

    st.tileCount = 4;
    st.gridCount = 25;

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

    var setupTiles = function() {
      for (var i = 0; i < st.protocolSettlementTiles.settlementTiles.length; i++) {
        st.protocolSettlementTiles.settlementTiles[i].done = tileDone(st.protocolSettlementTiles.settlementTiles[i]);
        st.protocolSettlementTiles.settlementTiles[i].imageUrl = (st.protocolSettlementTiles.settlementTiles[i].tilePhoto) ?
          st.protocolSettlementTiles.settlementTiles[i].tilePhoto.path : '';
      }
    };

    $scope.$on('incrementalSaveSettlementTiles', function() {
      st.saveOnBlur();
    });

    st.saveOnBlur = function() {
      if (st.protocolSettlementTiles._id) {
        $http.post('/api/protocol-settlement-tiles/' + st.protocolSettlementTiles._id + '/incremental-save',
        st.protocolSettlementTiles)
        .success(function (data, status, headers, config) {
          st.protocolSettlementTiles = new ProtocolSettlementTilesService(data.settlementTiles);
          st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
          if (data.errors) {
            st.error = data.errors;
            st.form.settlementTilesForm.$setSubmitted(true);
            $rootScope.$broadcast('incrementalSaveSettlementTilesError');
          }
          if (data.successful) {
            st.error = null;
            $rootScope.$broadcast('incrementalSaveSettlementTilesSuccessful');
          }
          setupTiles();
        })
        .error(function (data, status, header, config) {
          st.error = data.message;
          st.form.settlementTilesForm.$setSubmitted(true);
          $rootScope.$broadcast('incrementalSaveSettlementTilesError');
        });
      }
    };

    var setupSettlementTileGrid = function() {
      if (!st.protocolSettlementTiles.settlementTiles) {
        st.protocolSettlementTiles = {
          settlementTiles: []
        };
      }

      var totalToAdd = st.tileCount - st.protocolSettlementTiles.settlementTiles.length;
      for (var i = 0; i < totalToAdd; i++) {
        st.protocolSettlementTiles.settlementTiles.push({
          grid1: { notes: '' },
          grid2: { notes: '' },
          grid3: { notes: '' },
          grid4: { notes: '' },
          grid5: { notes: '' },
          grid6: { notes: '' },
          grid7: { notes: '' },
          grid8: { notes: '' },
          grid9: { notes: '' },
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
      st.saveOnBlur();
    };

    // Set up Protocol Settlement Tiles
    st.protocolSettlementTiles = {};
    if ($stateParams.protocolSettlementTileId) {
      ProtocolSettlementTilesService.get({
        settlementTileId: $stateParams.protocolSettlementTileId
      }, function(data) {
        st.protocolSettlementTiles = data;
        st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
      });
    } else if ($scope.protocolSettlementTiles) {
      st.protocolSettlementTiles = new ProtocolSettlementTilesService($scope.protocolSettlementTiles);
      if (!st.protocolSettlementTiles.settlementTiles || st.protocolSettlementTiles.settlementTiles.length < st.tileCount) {
        setupSettlementTileGrid();
      }
      st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
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

    st.teamMemberSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'displayName',
      textLookup: function(id) {
        return TeamMembersService.get({ memberId: id }).$promise;
      },
      options: function(searchText) {
        return TeamMembersService.query();
      }
    };

    st.dateTime = {
      min: moment().subtract(7, 'days').toDate(),
      max: moment().add(1, 'year').toDate()
    };

    // Remove existing protocol settlemen tile
    st.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        st.protocolSettlementTiles.$remove($state.go('protocol-settlement-tiles.main'));
      }
    };

    $scope.$on('saveSettlementTiles', function() {
      st.form.settlementTilesForm.$setSubmitted(true);
      st.save(st.form.settlementTilesForm.$valid);
    });

    // Save protocol settlement tile
    st.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'st.form.settlementTilesForm');
        $rootScope.$broadcast('saveSettlementTilesError');
        return false;
      }

      var errorMessages = [];

      if (!st.protocolSettlementTiles || st.protocolSettlementTiles.length < 1) {
        errorMessages.push('Must have at least one settlement tile');
      } else {
        var oneSuccessfulSettlementTile = false;

        var allGridsFilledIn = function(tile, i) {
          var successfulGrids = true;
          for (var j = 1; j <= st.gridCount; j++) {
            if (tile['grid'+j]) {
              if ((tile['grid'+j].organism === null || tile['grid'+j].organism === undefined) &&
              (tile['grid'+j].notes === '' || tile['grid'+j].notes === null || tile['grid'+j].notes === undefined)) {
                successfulGrids = false;
              }
            } else {
              successfulGrids = false;
            }
            return successfulGrids;
          }
        };

        for (var i = 0; i < st.protocolSettlementTiles.settlementTiles.length; i++) {
          var tile = st.protocolSettlementTiles.settlementTiles[i];

          if (tile.tilePhoto && tile.tilePhoto.path !== undefined && tile.tilePhoto.path !== '' &&
          allGridsFilledIn(tile, i)) {
            oneSuccessfulSettlementTile = true;
          } else if (!tile.description && (!tile.tilePhoto || tile.tilePhoto.path === undefined ||
          tile.tilePhoto.path === '') && !allGridsFilledIn(tile, i)) {
          } else {
            if (!tile.tilePhoto || !tile.tilePhoto.path || tile.tilePhoto.path === '') {
              errorMessages.push('Photo is required for Settlement Tile #' + (i+1));
            }
            if (!allGridsFilledIn(tile, i)) {
              errorMessages.push('Settlement Tile #' + (i+1) + ' must have a dominant organism specified for all 25 grid spaces');
            }
          }
        }

        if (!oneSuccessfulSettlementTile) {
          if (errorMessages.length > 0) {
            st.error = errorMessages;
          }
          $scope.$broadcast('show-errors-check-validity', 'st.form.settlementTilesForm');
          $rootScope.$broadcast('saveSettlementTilesError');
          return false;
        }
      }

      // TODO: move create/update logic to service
      if (st.protocolSettlementTiles._id) {
        st.protocolSettlementTiles.$update(successCallback, errorCallback);
      } else {
        st.protocolSettlementTiles.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var settlementTileId = res._id;

        function uploadAllSettlementTilePhotos (settlementTileId, tilePhotosSuccessCallback, tilePhotosErrorCallback) {
          function uploadSettlementTilePhoto(settlementTileId, index, tilePhotoSuccessCallback, tilePhotoErrorCallback) {
            if (index < st.settlementTilePhotoUploaders.length && st.settlementTilePhotoUploaders[index]) {
              var uploader = st.settlementTilePhotoUploaders[index];
              if (uploader.queue.length > 0) {
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                  uploadSettlementTilePhoto(settlementTileId, index+1, tilePhotoSuccessCallback, tilePhotoErrorCallback);
                };

                uploader.onErrorItem = function (fileItem, response, status, header) {
                  st.protocolSettlementTiles.settlementTiles[index].tilePhoto.error = response.message;
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
          $rootScope.$broadcast('saveSettlementTilesSuccessful');
        }, function(errorMessage) {
          st.error = errorMessage;
          $rootScope.$broadcast('saveSettlementTilesError');
          return false;
        });
      }

      function errorCallback(res) {
        st.error = res.data.message;
        $rootScope.$broadcast('saveSettlementTilesError');
      }
    };

    st.cancel = function() {
      $state.go('protocol-settlement-tiles.main');
    };

    st.openSettlementTileForm = function(index) {
      $rootScope.$broadcast('stopSaving');
      st.grids = [];
      var tile = st.protocolSettlementTiles.settlementTiles[index-1];
      for (var i = 1; i <= st.gridCount; i++) {
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
      }
      angular.element('#modal-settlementtile'+index).modal('show');
    };

    st.saveSettlementTileForm = function(grids, index, isValid) {
      angular.element('#modal-settlementtile'+index).modal('hide');

      $timeout(function() {
        st.protocolSettlementTiles.settlementTiles[index-1].done =
          tileDone(st.protocolSettlementTiles.settlementTiles[index-1]);
        for (var i = 1; i <= grids.length; i++) {
          st.protocolSettlementTiles.settlementTiles[index-1]['grid'+i] = {
            organism: (grids[i-1].organismId !== '-1') ? grids[i-1].organismId : undefined,
            notes: grids[i-1].notes
          };
        }
        st.protocolSettlementTiles.settlementTiles[index-1].done =
          tileDone(st.protocolSettlementTiles.settlementTiles[index-1]);
        st.saveOnBlur();
        $rootScope.$broadcast('startSaving');
      }, 1000);
    };

    st.cancelSettlementTileForm = function(index) {
      angular.element('#modal-settlementtile'+index).modal('hide');
      $rootScope.$broadcast('startSaving');
    };

    var saveImageOnBlur = function(index, successCallback, errorCallback) {
      if (st.protocolSettlementTiles._id && st.protocolSettlementTiles.settlementTiles[index].imageUrl !== '') {
        if (index < st.settlementTilePhotoUploaders.length && st.settlementTilePhotoUploaders[index]) {
          var uploader = st.settlementTilePhotoUploaders[index];
          if (uploader.queue.length > 0) {
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
              uploader.removeFromQueue(fileItem);
              successCallback();
            };

            uploader.onErrorItem = function (fileItem, response, status, header) {
              st.protocolSettlementTiles.settlementTiles[index].tilePhoto.error = response.message;
              errorCallback();
            };

            uploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-settlement-tiles/' + st.protocolSettlementTiles._id + '/index/' + index + '/upload-tile-photo';
            };
            uploader.uploadAll();
          } else {
            successCallback();
          }
        } else {
          errorCallback('Error with tile');
        }
      } else if (st.protocolSettlementTiles._id && st.protocolSettlementTiles.settlementTiles &&
        st.protocolSettlementTiles.settlementTiles[index] &&
        st.protocolSettlementTiles.settlementTiles[index].tilePhoto &&
        st.protocolSettlementTiles.settlementTiles[index].imageUrl === '') {
        st.protocolSettlementTiles.settlementTiles[index].tilePhoto.path = '';
        st.saveOnBlur();
      }
    };

    $scope.$watch('st.protocolSettlementTiles.settlementTiles[0].imageUrl', function(newValue, oldValue) {
      saveImageOnBlur(0, function() {
        ProtocolSettlementTilesService.get({
          settlementTileId: st.protocolSettlementTiles._id
        }, function(data) {
          st.protocolSettlementTiles = data;
          st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
          setupTiles();
        });
      }, function(errorMessage) {
        st.error = errorMessage;
      });
    });

    $scope.$watch('st.protocolSettlementTiles.settlementTiles[1].imageUrl', function(newValue, oldValue) {
      saveImageOnBlur(1, function() {
        ProtocolSettlementTilesService.get({
          settlementTileId: st.protocolSettlementTiles._id
        }, function(data) {
          st.protocolSettlementTiles = data;
          st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
          setupTiles();
        });
      }, function(errorMessage) {
        st.error = errorMessage;
      });
    });

    $scope.$watch('st.protocolSettlementTiles.settlementTiles[2].imageUrl', function(newValue, oldValue) {
      saveImageOnBlur(2, function() {
        ProtocolSettlementTilesService.get({
          settlementTileId: st.protocolSettlementTiles._id
        }, function(data) {
          st.protocolSettlementTiles = data;
          st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
          setupTiles();
        });
      }, function(errorMessage) {
        st.error = errorMessage;
      });
    });

    $scope.$watch('st.protocolSettlementTiles.settlementTiles[3].imageUrl', function(newValue, oldValue) {
      saveImageOnBlur(3, function() {
        ProtocolSettlementTilesService.get({
          settlementTileId: st.protocolSettlementTiles._id
        }, function(data) {
          st.protocolSettlementTiles = data;
          st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
          setupTiles();
        });
      }, function(errorMessage) {
        st.error = errorMessage;
      });
    });

    $timeout(function() {
      st.saveOnBlur();
    }, 3000);

    st.openMap = function() {
      $rootScope.$broadcast('stopSaving');
    };

    st.closeMap = function() {
      $rootScope.$broadcast('startSaving');
    };
  }
})();
