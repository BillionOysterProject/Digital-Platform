(function () {
  'use strict';

  angular
    .module('protocol-site-conditions')
    .controller('ProtocolSiteConditionsController', ProtocolSiteConditionsController);

  ProtocolSiteConditionsController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', '$stateParams', '$timeout',
  'lodash', 'Authentication', 'FileUploader', 'ProtocolSiteConditionsService', 'WeatherConditionsService', 'WaterColorsService',
  'WaterFlowService', 'ShorelineTypesService', 'TeamMembersService'];

  function ProtocolSiteConditionsController($scope, $rootScope, $state, $http, moment, $stateParams, $timeout,
    lodash, Authentication, FileUploader, ProtocolSiteConditionsService, WeatherConditionsService, WaterColorsService,
    WaterFlowService, ShorelineTypesService, TeamMembersService) {
    var sc = this;

    // Set up Protocol Site Condition
    sc.protocolSiteCondition = {};
    if ($stateParams.protocolSiteConditionId) {
      ProtocolSiteConditionsService.get({
        siteConditionId: $stateParams.protocolSiteConditionId
      }, function(data) {
        sc.protocolSiteCondition = data;
        sc.waterConditionPhotoURL = (sc.protocolSiteCondition.waterConditions &&
          sc.protocolSiteCondition.waterConditions.waterConditionPhoto) ?
          sc.protocolSiteCondition.waterConditions.waterConditionPhoto.path : '';
        sc.landConditionPhotoURL = (sc.protocolSiteCondition.landConditions &&
          sc.protocolSiteCondition.landConditions.landConditionPhoto) ?
          sc.protocolSiteCondition.landConditions.landConditionPhoto.path : '';
        sc.protocolSiteCondition.collectionTime = moment(sc.protocolSiteCondition.collectionTime).startOf('minute').toDate();
        if (sc.protocolSiteCondition.tideConditions === undefined) {
          sc.protocolSiteCondition.tideConditions = {
            closestHighTide: moment().startOf('minute').toDate(),
            closestLowTide: moment().startOf('minute').toDate()
          };
        } else {
          sc.protocolSiteCondition.tideConditions.closestHighTide = (sc.protocolSiteCondition.tideConditions.closestHighTide) ?
            moment(sc.protocolSiteCondition.tideConditions.closestHighTide).toDate() : moment().startOf('minute').toDate();
          sc.protocolSiteCondition.tideConditions.closestLowTide = (sc.protocolSiteCondition.tideConditions.closestLowTide) ?
            moment(sc.protocolSiteCondition.tideConditions.closestLowTide).toDate() : moment().startOf('minute').toDate();
        }
        $scope.protocolSiteCondition = sc.protocolSiteCondition;
      });
    } else if ($scope.protocolSiteCondition) {
      sc.protocolSiteCondition = new ProtocolSiteConditionsService($scope.protocolSiteCondition);
      sc.waterConditionPhotoURL = (sc.protocolSiteCondition.waterConditions &&
        sc.protocolSiteCondition.waterConditions.waterConditionPhoto) ?
        sc.protocolSiteCondition.waterConditions.waterConditionPhoto.path : '';
      sc.landConditionPhotoURL = (sc.protocolSiteCondition.landConditions &&
        sc.protocolSiteCondition.landConditions.landConditionPhoto) ?
        sc.protocolSiteCondition.landConditions.landConditionPhoto.path : '';
      sc.protocolSiteCondition.collectionTime = moment(sc.protocolSiteCondition.collectionTime).startOf('minute').toDate();
      if (sc.protocolSiteCondition.tideConditions === undefined) {
        sc.protocolSiteCondition.tideConditions = {
          closestHighTide: moment().startOf('minute').toDate(),
          closestLowTide: moment().startOf('minute').toDate()
        };
      } else {
        sc.protocolSiteCondition.tideConditions.closestHighTide = (sc.protocolSiteCondition.tideConditions.closestHighTide) ?
          moment(sc.protocolSiteCondition.tideConditions.closestHighTide).toDate() : moment().startOf('minute').toDate();
        sc.protocolSiteCondition.tideConditions.closestLowTide = (sc.protocolSiteCondition.tideConditions.closestLowTide) ?
          moment(sc.protocolSiteCondition.tideConditions.closestLowTide).toDate() : moment().startOf('minute').toDate();
      }
      if (!sc.protocolSiteCondition.landConditions) {
        sc.protocolSiteCondition.landConditions = {
          shorelineSurfaceCoverEstPer: {
            imperviousSurfacePer: 0,
            perviousSurfacePer: 0,
            vegetatedSurfacePer: 0
          }
        };
      }
      $scope.protocolSiteCondition = sc.protocolSiteCondition;
    } else {
      sc.protocolSiteCondition = new ProtocolSiteConditionsService();
      sc.protocolSiteCondition.landConditions = {
        shorelineSurfaceCoverEstPer: {
          imperviousSurfacePer: 0,
          perviousSurfacePer: 0,
          vegetatedSurfacePer: 0
        }
      };
      sc.waterConditionPhotoURL = '';
      sc.landConditionPhotoURL = '';
      sc.protocolSiteCondition.tideConditions = {
        closestHighTide: moment().startOf('minute').toDate(),
        closestLowTide: moment().startOf('minute').toDate()
      };
      $scope.protocolSiteCondition = sc.protocolSiteCondition;
    }

    sc.weatherConditions = WeatherConditionsService.query();
    sc.waterColors = WaterColorsService.query();
    sc.waterFlows = WaterFlowService.query();
    sc.shorelineTypes = ShorelineTypesService.query();

    sc.authentication = Authentication;
    sc.error = null;
    sc.form = {};

    sc.teamMemberSelectConfig = {
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

    sc.dateTime = {
      min: moment().subtract(7, 'days').toDate(),
      max: moment().add(1, 'year').toDate()
    };

    sc.garbageExtent = [
      { label: 'None', value: 'none' },
      { label: 'Sporadic', value: 'sporadic' },
      { label: 'Common', value: 'common' },
      { label: 'Extensive', value: 'extensive' }
    ];

    sc.trueFalse = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];

    sc.waterConditionUploader = new FileUploader({
      alias: 'newWaterConditionPicture',
    });

    sc.landConditionUploader = new FileUploader({
      alias: 'newLandConditionPicture',
    });

    $scope.$on('saveValuesToScope', function() {
      $scope.protocolSiteCondition = sc.protocolSiteCondition;
    });

    $scope.$on('incrementalSaveSiteCondition', function() {
      sc.saveOnBlur();
    });

    sc.saveOnBlur = function() {
      if (sc.protocolSiteCondition._id && ((sc.form.siteConditionForm.$touched && sc.form.siteConditionForm.$dirty) ||
        sc.form.siteConditionForm.$valid || (sc.protocolSiteCondition.meteorologicalConditions &&
          sc.protocolSiteCondition.meteorologicalConditions.weatherConditions))) {
        console.log('incremental-save');
        $rootScope.$broadcast('savingStart');
        $http.post('/api/protocol-site-conditions/' + sc.protocolSiteCondition._id + '/incremental-save',
        sc.protocolSiteCondition)
        .success(function (data, status, headers, config) {
          if (data.errors) {
            sc.error = data.errors;
            sc.form.siteConditionForm.$setSubmitted(true);
            $scope.protocolSiteCondition = sc.protocolSiteCondition;
            $rootScope.$broadcast('incrementalSaveSiteConditionError');
          } else if (data.scribe) {
            $rootScope.$broadcast('removeSubmittedProtocolTab', {
              values: {
                scribeName: data.scribe,
                protocolName: 'Site Conditions',
                protocol: 'protocol1'
              }
            });
            $scope.protocolSiteCondition = null;
          } else if (data.successful) {
            sc.error = null;
            $scope.protocolSiteCondition = sc.protocolSiteCondition;
            $rootScope.$broadcast('incrementalSaveSiteConditionSuccessful');
          }
          $rootScope.$broadcast('savingStop');
        })
        .error(function (data, status, headers, config) {
          sc.error = data.message;
          sc.form.siteConditionForm.$setSubmitted(true);
          $rootScope.$broadcast('incrementalSaveSiteConditionError');
          $rootScope.$broadcast('savingStop');
        });
      } else {
        $rootScope.$broadcast('savingStop');
      }
    };

    $scope.$watch('sc.waterConditionPhotoURL', function(newValue, oldValue) {
      if (sc.protocolSiteCondition._id && sc.waterConditionPhotoURL !== '') {
        if (sc.waterConditionUploader.queue.length > 0) {
          sc.waterConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
            sc.waterConditionUploader.removeFromQueue(fileItem);
            ProtocolSiteConditionsService.get({
              siteConditionId: sc.protocolSiteCondition._id
            }, function(data) {
              if (data.scribeMember.username !== Authentication.user.username && data.status === 'submitted') {
                $rootScope.$broadcast('removeSubmittedProtocolTab', {
                  values: {
                    scribeName: data.scribeMember.displayName,
                    protocolName: 'Site Conditions',
                    protocol: 'protocol1'
                  }
                });
                $scope.protocolSiteCondition = null;
              } else {
                if (!sc.protocolSiteCondition.waterConditions) {
                  sc.protocolSiteCondition.waterConditions = {};
                }
                sc.protocolSiteCondition.waterConditions.waterConditionPhoto = data.waterConditions.waterConditionPhoto;
                sc.waterConditionPhotoURL = (sc.protocolSiteCondition.waterConditions &&
                  sc.protocolSiteCondition.waterConditions.waterConditionPhoto) ?
                  sc.protocolSiteCondition.waterConditions.waterConditionPhoto.path : '';
                $scope.protocolSiteCondition = sc.protocolSiteCondition;
              }
              $rootScope.$broadcast('savingStop');
            });
          };

          sc.waterConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
            sc.error = response.message;
            $rootScope.$broadcast('savingStop');
          };

          sc.waterConditionUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/protocol-site-conditions/' + sc.protocolSiteCondition._id + '/upload-water-condition';
          };
          $rootScope.$broadcast('savingStart');
          sc.waterConditionUploader.uploadAll();
        }
      } else if (sc.protocolSiteCondition._id && sc.waterConditionPhotoURL === '' &&
        sc.protocolSiteCondition.waterConditions && sc.protocolSiteCondition.waterConditions.waterConditionPhoto) {
        $rootScope.$broadcast('savingStart');
        sc.protocolSiteCondition.waterConditions.waterConditionPhoto.path = '';
        sc.saveOnBlur();
      }
    });

    $scope.$watch('sc.landConditionPhotoURL', function(newValue, oldValue) {
      if (sc.protocolSiteCondition._id && sc.landConditionPhotoURL !== '') {
        if (sc.landConditionUploader.queue.length > 0) {
          sc.landConditionUploader.onSuccessItem = function (fileItem, response, status, headers) {
            sc.landConditionUploader.removeFromQueue(fileItem);
            ProtocolSiteConditionsService.get({
              siteConditionId: sc.protocolSiteCondition._id
            }, function(data) {
              if (data.scribeMember.username !== Authentication.user.username && data.status === 'submitted') {
                $rootScope.$broadcast('removeSubmittedProtocolTab', {
                  values: {
                    scribeName: data.scribeMember.displayName,
                    protocolName: 'Site Conditions',
                    protocol: 'protocol1'
                  }
                });
                $scope.protocolSiteCondition = null;
              } else {
                if (!sc.protocolSiteCondition.landConditions) {
                  sc.protocolSiteCondition.landConditions = {};
                }
                sc.protocolSiteCondition.landConditions.landConditionPhoto = data.landConditions.landConditionPhoto;
                sc.landConditionPhotoURL = (sc.protocolSiteCondition.landConditions &&
                  sc.protocolSiteCondition.landConditions.landConditionPhoto) ?
                  sc.protocolSiteCondition.landConditions.landConditionPhoto.path : '';
                $scope.protocolSiteCondition = sc.protocolSiteCondition;
              }
              $rootScope.$broadcast('savingStop');
            });
          };

          sc.landConditionUploader.onErrorItem = function (fileItem, response, status, headers) {
            sc.error = response.message;
            $rootScope.$broadcast('savingStop');
          };

          sc.landConditionUploader.onBeforeUploadItem = function(item) {
            item.url = 'api/protocol-site-conditions/' + sc.protocolSiteCondition._id + '/upload-land-condition';
          };
          $rootScope.$broadcast('savingStart');
          sc.landConditionUploader.uploadAll();
        }
      } else if (sc.protocolSiteCondition._id && sc.landConditionPhotoURL === '' &&
        sc.protocolSiteCondition.landConditions && sc.protocolSiteCondition.landConditions.landConditionPhoto) {
        $rootScope.$broadcast('savingStart');
        sc.protocolSiteCondition.landConditions.landConditionPhoto.path = '';
        sc.saveOnBlur();
      }
    });

    $timeout(function() {
      if (sc && sc.protocolSiteCondition && sc.protocolSiteCondition._id) {
        sc.saveOnBlur();
        $rootScope.$broadcast('startIncrementalSavingLoop');
      }
    });

    sc.openMap = function() {
      $rootScope.$broadcast('stopIncrementalSavingLoop');
    };

    sc.closeMap = function() {
      $rootScope.$broadcast('startIncrementalSavingLoop');
    };

  }
})();
