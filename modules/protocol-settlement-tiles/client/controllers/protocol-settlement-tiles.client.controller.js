(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .controller('ProtocolSettlementTilesController', ProtocolSettlementTilesController);

  ProtocolSettlementTilesController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
  'lodash', 'Authentication', 'ProtocolSettlementTilesService', 'SessileOrganismsService', 'TeamMembersService', 'FileUploader'];

  function ProtocolSettlementTilesController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    lodash, Authentication, ProtocolSettlementTilesService, SessileOrganismsService, TeamMembersService, FileUploader) {
    var st = this;

    st.tileCount = 4;
    st.gridCount = 25;

    st.tileStarted = function(settlementTile) {
      var started = false;
      for (var i = 1; i <= st.gridCount; i++) {
        if (settlementTile['grid'+i] && settlementTile['grid'+i].organism &&
          settlementTile['grid'+i].organism !== undefined && settlementTile['grid'+i].organism !== '' &&
          settlementTile['grid'+i].organism !== null) {
          started = true;
        }
      }
      return started;
    };

    var tileDone = function(settlementTile) {
      var done = true;
      if (!settlementTile.tilePhoto || !settlementTile.tilePhoto.path || settlementTile.tilePhoto.path === '') {
        done = false;
      }

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

    $scope.$on('saveValuesToScope', function() {
      $scope.protocolSettlementTiles = st.protocolSettlementTiles;
    });

    $scope.$on('incrementalSaveSettlementTiles', function() {
      st.saveOnBlur();
    });

    st.saveOnBlur = function(forceSave, callback) {
      if (st.protocolSettlementTiles._id && ((st.form && st.form.settlementTilesForm &
        st.form.settlementTilesForm.$touched && st.form.settlementTilesForm.$dirty) ||
        (st.protocolSettlementTiles.settlementTiles && st.protocolSettlementTiles.settlementTiles.length > 0 &&
        (st.tileStarted(st.protocolSettlementTiles.settlementTiles[0]) ||
        st.protocolSettlementTiles.settlementTiles[0].imageUrl))) || forceSave) {
        $rootScope.$broadcast('savingStart');
        console.log('incremental-save');
        $http.post('/api/protocol-settlement-tiles/' + st.protocolSettlementTiles._id + '/incremental-save',
        st.protocolSettlementTiles)
        .success(function (data, status, headers, config) {
          if (data.errors && !forceSave) {
            st.error = data.errors;
            console.log('st.error', st.error);
            if (st.form && st.form.settlementTilesForm) st.form.settlementTilesForm.$setSubmitted(true);
            $scope.protocolSettlementTiles = st.protocolSettlementTiles;
            $rootScope.$broadcast('incrementalSaveSettlementTilesError');
          } else if (data.scribe && !forceSave) {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Settlement Tiles'
              }
            });
            $scope.protocolSettlementTiles = null;
          } else if (data.successful && !forceSave) {
            st.error = null;
            $scope.protocolSettlementTiles = st.protocolSettlementTiles;
            $rootScope.$broadcast('incrementalSaveSettlementTilesSuccessful');
          }
          $rootScope.$broadcast('savingStop');
          if (callback) callback();
        })
        .error(function (data, status, header, config) {
          st.error = data.message;
          console.log('st.error', st.error);
          if (st.form && st.form.settlementTilesForm && !forceSave) st.form.settlementTilesForm.$setSubmitted(true);
          if (!forceSave) $rootScope.$broadcast('incrementalSaveSettlementTilesError');
          $rootScope.$broadcast('savingStop');
          if (callback) callback();
        });
      } else {
        $rootScope.$broadcast('savingStop');
        if (callback) callback();
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
      st.saveOnBlur(true);
    };

    var readFromScope = function() {
      st.protocolSettlementTiles = new ProtocolSettlementTilesService($scope.protocolSettlementTiles);
      if (!st.protocolSettlementTiles.settlementTiles || st.protocolSettlementTiles.settlementTiles.length < st.tileCount) {
        setupSettlementTileGrid();
      }
      st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
      $scope.protocolSettlementTiles = st.protocolSettlementTiles;
    };

    $scope.$on('readSettlementTilesFromScope', function() {
      readFromScope();
    });

    // Set up Protocol Settlement Tiles
    st.protocolSettlementTiles = {};
    if ($stateParams.protocolSettlementTileId) {
      ProtocolSettlementTilesService.get({
        settlementTileId: $stateParams.protocolSettlementTileId
      }, function(data) {
        st.protocolSettlementTiles = data;
        st.protocolSettlementTiles.collectionTime = moment(st.protocolSettlementTiles.collectionTime).startOf('minute').toDate();
        $scope.protocolSettlementTiles = st.protocolSettlementTiles;
      });
    } else if ($scope.protocolSettlementTiles) {
      readFromScope();
    } else {
      st.protocolSettlementTiles = new ProtocolSettlementTilesService();
      setupSettlementTileGrid();
      $scope.protocolSettlementTiles = st.protocolSettlementTiles;
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

    st.openSettlementTileForm = function(index) {
      $rootScope.$broadcast('stopIncrementalSavingLoop');
      st.grids = [];
      var tile = st.protocolSettlementTiles.settlementTiles[index-1];
      for (var i = 1; i <= st.gridCount; i++) {
        if (tile['grid'+i]) {
          var organismId = (tile['grid'+i].organism && tile['grid'+i].organism._id) ?
            tile['grid'+i].organism._id : tile['grid'+i].organism;

          if ((!organismId || organismId === undefined || organismId === null || organismId === '') &&
          tile['grid'+i].notes !== '') {
            organismId = '-1';
          }
          st.grids[i-1] = {
            organismId: organismId,
            notes: tile['grid'+i].notes
          };

        } else {
          st.grids[i-1] = {
            organismId: null,
            notes: null
          };
        }
      }
      angular.element('#modal-settlementtile'+index).modal('show');
    };

    st.saveSettlementTileForm = function(grids, index, isValid) {
      angular.element('#modal-settlementtile'+index).modal('hide');

      $timeout(function() {
        $rootScope.$broadcast('savingStart');
        for (var i = 1; i <= grids.length; i++) {
          st.protocolSettlementTiles.settlementTiles[index-1]['grid'+i] = {
            organism: (grids[i-1].organismId !== '-1') ? grids[i-1].organismId : undefined,
            notes: grids[i-1].notes
          };
        }
        st.protocolSettlementTiles.settlementTiles[index-1].done =
          tileDone(st.protocolSettlementTiles.settlementTiles[index-1]);
        console.log('settlementTiles', st.protocolSettlementTiles);
        st.saveOnBlur(true, function() {
          $rootScope.$broadcast('startIncrementalSavingLoop');
        });
      }, 1000);
    };

    st.cancelSettlementTileForm = function(index) {
      angular.element('#modal-settlementtile'+index).modal('hide');
      $rootScope.$broadcast('startIncrementalSavingLoop');
    };

    var saveImageOnBlur = function(index, successCallback, errorCallback) {
      if (st.protocolSettlementTiles._id && st.protocolSettlementTiles.settlementTiles[index].imageUrl !== '') {
        if (index < st.settlementTilePhotoUploaders.length && st.settlementTilePhotoUploaders[index]) {
          var uploader = st.settlementTilePhotoUploaders[index];
          if (uploader.queue.length > 0) {
            var spinner;
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
              uploader.removeFromQueue(fileItem);
              st.error = null;
              $rootScope.$broadcast('savingStop');
              spinner.stop();
              successCallback();
            };

            uploader.onErrorItem = function (fileItem, response, status, header) {
              st.protocolSettlementTiles.settlementTiles[index].tilePhoto.error = response.message;
              st.error = response.message;
              $rootScope.$broadcast('savingStop');
              spinner.stop();
              errorCallback();
            };

            uploader.onBeforeUploadItem = function(item) {
              item.url = 'api/protocol-settlement-tiles/' + st.protocolSettlementTiles._id + '/index/' + index + '/upload-tile-photo';
            };
            $rootScope.$broadcast('savingStart');
            spinner = new Spinner({}).spin(document.getElementById('settlement-tile-image-dropzone-'+index));
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
        $rootScope.$broadcast('savingStart');
        st.protocolSettlementTiles.settlementTiles[index].tilePhoto.path = '';
        st.saveOnBlur();
      }
    };

    $scope.$watch('st.protocolSettlementTiles.settlementTiles[0].imageUrl', function(newValue, oldValue) {
      saveImageOnBlur(0, function() {
        ProtocolSettlementTilesService.get({
          settlementTileId: st.protocolSettlementTiles._id
        }, function(data) {
          if (data.scribeMember.username !== Authentication.user.username && data.status === 'submitted') {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribeMember.displayName,
                protocolName: 'Settlement Tiles',
                protocol: 'protocol4'
              }
            });
          } else {
            if (!st.protocolSettlementTiles.settlementTiles) {
              st.protocolSettlementTiles.settlementTiles = [];
            }
            st.protocolSettlementTiles.settlementTiles[0].tilePhoto = data.settlementTiles[0].tilePhoto;
            st.protocolSettlementTiles.settlementTiles[0].imageUrl = (st.protocolSettlementTiles.settlementTiles[0] &&
              st.protocolSettlementTiles.settlementTiles[0].tilePhoto) ?
              st.protocolSettlementTiles.settlementTiles[0].tilePhoto.path : '';
            $scope.protocolSettlementTiles = st.protocolSettlementTiles;
          }
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
          if (data.scribeMember.username !== Authentication.user.username && data.status === 'submitted') {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Settlement Tiles',
                protocol: 'protocol4'
              }
            });
          } else {
            if (!st.protocolSettlementTiles.settlementTiles) {
              st.protocolSettlementTiles.settlementTiles = [];
            }
            st.protocolSettlementTiles.settlementTiles[1].tilePhoto = data.settlementTiles[1].tilePhoto;
            st.protocolSettlementTiles.settlementTiles[1].imageUrl = (st.protocolSettlementTiles.settlementTiles[1] &&
              st.protocolSettlementTiles.settlementTiles[1].tilePhoto) ?
              st.protocolSettlementTiles.settlementTiles[1].tilePhoto.path : '';
            $scope.protocolSettlementTiles = st.protocolSettlementTiles;
          }
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
          if (data.scribeMember.username !== Authentication.user.username && data.status === 'submitted') {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Settlment Tiles',
                protocol: 'protocol4'
              }
            });
          } else {
            if (!st.protocolSettlementTiles.settlementTiles) {
              st.protocolSettlementTiles.settlementTiles = [];
            }
            st.protocolSettlementTiles.settlementTiles[2].tilePhoto = data.settlementTiles[2].tilePhoto;
            st.protocolSettlementTiles.settlementTiles[2].imageUrl = (st.protocolSettlementTiles.settlementTiles[2] &&
              st.protocolSettlementTiles.settlementTiles[2].tilePhoto) ?
              st.protocolSettlementTiles.settlementTiles[2].tilePhoto.path : '';
            $scope.protocolSettlementTiles = st.protocolSettlementTiles;
          }
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
          console.log('Authentication.user', Authentication.user);
          if (data.scribeMember.username !== Authentication.user.username && data.status === 'submitted') {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Settlement Tiles',
                protocol: 'protocol4'
              }
            });
          } else {
            if (!st.protocolSettlementTiles.settlementTiles) {
              st.protocolSettlementTiles.settlementTiles = [];
            }
            st.protocolSettlementTiles.settlementTiles[3].tilePhoto = data.settlementTiles[3].tilePhoto;
            st.protocolSettlementTiles.settlementTiles[3].imageUrl = (st.protocolSettlementTiles.settlementTiles[3] &&
              st.protocolSettlementTiles.settlementTiles[3].tilePhoto) ?
              st.protocolSettlementTiles.settlementTiles[3].tilePhoto.path : '';
            $scope.protocolSettlementTiles = st.protocolSettlementTiles;
          }
        });
      }, function(errorMessage) {
        st.error = errorMessage;
      });
    });

    $timeout(function() {
      if (st && st.protocolSettlementTiles && st.protocolSettlementTiles._id) {
        st.saveOnBlur();
        $rootScope.$broadcast('startIncrementalSavingLoop');
      }
    }, 1500);

    st.openMap = function() {
      $rootScope.$broadcast('stopIncrementalSavingLoop');
    };

    st.closeMap = function() {
      $rootScope.$broadcast('startIncrementalSavingLoop');
    };
  }
})();
