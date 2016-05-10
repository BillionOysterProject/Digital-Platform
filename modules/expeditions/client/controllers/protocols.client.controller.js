(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionProtocolsController', ExpeditionProtocolsController);

  ExpeditionProtocolsController.$inject = ['$scope', '$rootScope', '$state', '$http', 'moment', 'lodash', '$timeout',
  'expeditionResolve', 'Authentication', 'TeamsService', 'ProtocolMobileTrapsService', 'ProtocolOysterMeasurementsService',
  'ProtocolSettlementTilesService', 'ProtocolSiteConditionsService', 'ProtocolWaterQualityService',
  'ExpeditionsService', 'ExpeditionActivitiesService'];

  function ExpeditionProtocolsController($scope, $rootScope, $state, $http, moment, lodash, $timeout,
    expedition, Authentication, TeamsService, ProtocolMobileTrapsService, ProtocolOysterMeasurementsService,
    ProtocolSettlementTilesService, ProtocolSiteConditionsService, ProtocolWaterQualityService,
    ExpeditionsService, ExpeditionActivitiesService) {
    var vm = this;
    vm.expedition = expedition;
    vm.user = Authentication.user;
    vm.activeTab = 'protocol1';
    vm.savingLoop = true;

    TeamsService.get({
      teamId: vm.expedition.team._id
    }, function(data) {
      vm.team = data;
    });

    vm.getExpeditionDate = function() {
      return moment(vm.expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
    };

    vm.getExpeditionTimeRange = function(expedition) {
      return moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm')+'-'+
        moment(expedition.monitoringEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm');
    };

    vm.expeditionLink = function(expedition) {
      return ((vm.isTeamLead || vm.isAdmin) && (expedition.status === 'incomplete' || expedition.status === 'returned' ||
        expedition.status === 'unpublished')) ?
      'expeditions.edit({ expeditionId: expedition._id })' :
      'expeditions.protocols({ expeditionId: expedition._id })';
    };

    var checkRole = function(role) {
      var teamLeadIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');
    vm.isAdmin = checkRole('admin');

    vm.checkWrite = function(teamList) {
      if (checkRole('team lead') || checkRole('admin')) {
        return true;
      } else {
        var teamListIndex = lodash.findIndex(teamList, function(m) {
          return m.username === vm.user.username;
        });
        return (teamListIndex > -1) ? true : false;
      }
    };

    vm.setupInputValues = function(protocol, teamList, incrementalSaveUrl, callback) {
      var changed = false;
      if (vm.expedition.station) {

        if (!protocol.latitude && vm.expedition.station.latitude) {
          changed = true;
          protocol.latitude = vm.expedition.station.latitude;
        }
        if (!protocol.longitude && vm.expedition.station.longitude) {
          changed = true;
          protocol.longitude = vm.expedition.station.longitude;
        }
      }
      if (vm.expedition.monitoringStartDate) {
        if (!protocol.collectionTime) {
          changed = true;
          protocol.collectionTime = moment(vm.expedition.monitoringStartDate).toDate();
        }
      }
      if (teamList) {
        if (!protocol.teamMembers) {
          protocol.teamMembers = [];
        }
        for (var i = 0; i < teamList.length; i++) {
          var index = lodash.indexOf(protocol.teamMembers, teamList[i]._id);
          if (index === -1) {
            protocol.teamMembers.push(teamList[i]._id);
          }
        }
        protocol.teamMembers = lodash.uniq(protocol.teamMembers);
      }
      // if (changed) {
      //   $http.post(incrementalSaveUrl, protocol)
      //   .success(function (data, status, headers, config) {
      //     protocol = data;
      //     callback(protocol);
      //   })
      //   .error(function (data, status, headers, config) {
      //     callback(protocol);
      //   });
      // } else {
      callback(protocol);
      // }
    };

    vm.setupInputValues(vm.expedition.protocols.siteCondition, vm.expedition.teamLists.siteCondition,
      '/api/protocol-site-conditions/' + vm.expedition.protocols.siteCondition._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null) {
          vm.siteCondition = protocol;
          vm.viewSiteCondition = vm.checkWrite(vm.expedition.teamLists.siteCondition);
        } else {
          vm.siteCondition = null;
          vm.viewSiteCondition = false;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.oysterMeasurement, vm.expedition.teamLists.oysterMeasurement,
      '/api/protocol-oyster-measurements/' + vm.expedition.protocols.oysterMeasurement._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null) {
          vm.oysterMeasurement = protocol;
          vm.viewOysterMeasurement = vm.checkWrite(vm.expedition.teamLists.oysterMeasurement);
        } else {
          vm.oysterMeasurement = null;
          vm.viewOysterMeasurement = false;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.mobileTrap, vm.expedition.teamLists.mobileTrap,
      '/api/protocol-mobile-traps/' + vm.expedition.protocols.mobileTrap._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null) {
          vm.mobileTrap = protocol;
          vm.viewMobileTrap = vm.checkWrite(vm.expedition.teamLists.mobileTrap);
        } else {
          vm.mobileTrap = null;
          vm.viewMobileTrap = false;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.settlementTiles, vm.expedition.teamLists.settlementTiles,
      '/api/protocol-settlement-tiles/' + vm.expedition.protocols.settlementTiles._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null) {
          vm.settlementTiles = protocol;
          vm.viewSettlementTiles = vm.checkWrite(vm.expedition.teamLists.settlementTiles);
        } else {
          vm.settlementTiles = null;
          vm.viewSettlementTiles = false;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.waterQuality, vm.expedition.teamLists.waterQuality,
      '/api/protocol-water-quality/' + vm.expedition.protocols.waterQuality._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null) {
          vm.waterQuality = protocol;
          vm.viewWaterQuality = vm.checkWrite(vm.expedition.teamLists.waterQuality);
        } else {
          vm.waterQuality = null;
          vm.viewWaterQuality = false;
        }
      });

    vm.tabs = {
      protocol1: { isActive: false, visible: vm.viewSiteCondition, error: '' },
      protocol2: { isActive: false, visible: vm.viewOysterMeasurement, error: '' },
      protocol3: { isActive: false, visible: vm.viewMobileTrap, error: '' },
      protocol4: { isActive: false, visible: vm.viewSettlementTiles, error: '' },
      protocol5: { isActive: false, visible: vm.viewWaterQuality, error: '' }
    };

    for (var key in vm.tabs) {
      if (vm.tabs[key].visible) {
        vm.tabs[key].isActive = true;
        vm.activeTab = key;
        break;
      }
    }

    var timeIntervalInSec = 15;
    var incrementalSave = function(fn, timeInterval) {
      var promise = $timeout(fn, timeInterval);

      return promise.then(function(){
        incrementalSave(fn, timeInterval);
      });
    };
    var activeProtocolCall = function() {
      switch(vm.activeTab) {
        case 'protocol1': return 'incrementalSaveSiteCondition';
        case 'protocol2': return 'incrementalSaveOysterMeasurement';
        case 'protocol3': return 'incrementalSaveMobileTrap';
        case 'protocol4': return 'incrementalSaveSettlementTiles';
        case 'protocol5': return 'incrementalSaveWaterQuality';
      }
    };
    incrementalSave(function() {
      if (vm.savingLoop) {
        var saveCall = activeProtocolCall();
        $rootScope.$broadcast(saveCall);
        $scope.$emit('savingStart');
      }
    }, 1000 * timeIntervalInSec);

    $scope.$on('stopSaving', function() {
      vm.savingLoop = false;
    });

    $scope.$on('startSaving', function() {
      vm.savingLoop = true;
    });

    vm.switchTabs = function(key) {
      var saveCall = activeProtocolCall();
      $rootScope.$broadcast(saveCall);
      vm.activeTab = key;
    };

    vm.checkStatusIncomplete = function() {
      var protocolsComplete = true;
      if (vm.viewSiteCondition && vm.siteCondition.status === 'incomplete') protocolsComplete = false;
      if (vm.viewOysterMeasurement && vm.oysterMeasurement.status === 'incomplete') protocolsComplete = false;
      if (vm.viewMobileTrap && vm.mobileTrap.status === 'incomplete') protocolsComplete = false;
      if (vm.viewSettlementTiles && vm.settlementTiles.status === 'incomplete') protocolsComplete = false;
      if (vm.viewWaterQuality && vm.waterQuality.status === 'incomplete') protocolsComplete = false;
      return vm.expedition.status === 'incomplete' && !protocolsComplete;
    };

    vm.checkStatusPending = function() {
      var protocolsComplete = true;
      if (vm.viewSiteCondition && vm.siteCondition.status === 'incomplete') protocolsComplete = false;
      if (vm.viewOysterMeasurement && vm.oysterMeasurement.status === 'incomplete') protocolsComplete = false;
      if (vm.viewMobileTrap && vm.mobileTrap.status === 'incomplete') protocolsComplete = false;
      if (vm.viewSettlementTiles && vm.settlementTiles.status === 'incomplete') protocolsComplete = false;
      if (vm.viewWaterQuality && vm.waterQuality.status === 'incomplete') protocolsComplete = false;
      return vm.expedition.status === 'pending' || (protocolsComplete && vm.expedition.status !== 'published');
    };

    vm.checkStatusReturned = function() {
      var protocolsComplete = true;
      if (vm.viewSiteCondition && vm.siteCondition.status === 'incomplete') protocolsComplete = false;
      if (vm.viewOysterMeasurement && vm.oysterMeasurement.status === 'incomplete') protocolsComplete = false;
      if (vm.viewMobileTrap && vm.mobileTrap.status === 'incomplete') protocolsComplete = false;
      if (vm.viewSettlementTiles && vm.settlementTiles.status === 'incomplete') protocolsComplete = false;
      if (vm.viewWaterQuality && vm.waterQuality.status === 'incomplete') protocolsComplete = false;
      return vm.expedition.status === 'returned' && !protocolsComplete;
    };

    var checkAllSuccessful = function() {
      var allSuccessful = true;
      for (var key in vm.tabs) {
        if (vm.tabs[key].visible) {
          if (vm.tabs[key].saveSuccessful === undefined || !vm.tabs[key].saveSuccessful) {
            allSuccessful = false;
          }
        }
      }
      return allSuccessful;
    };


    var checkAllSaveSuccessful = function() {
      var allSuccessful = true;
      for (var key in vm.tabs) {
        if (vm.tabs[key].visible) {
          if (vm.tabs[key].submitSuccessful === undefined || !vm.tabs[key].submitSuccessful) {
            allSuccessful = false;
          }
        }
      }

      if (allSuccessful) {
        var protocols = {};
        if(vm.viewSiteCondition) protocols.siteCondition = vm.siteCondition;
        if(vm.viewOysterMeasurement) protocols.oysterMeasurement = vm.oysterMeasurement;
        if(vm.viewMobileTrap) protocols.mobileTrap = vm.mobileTrap;
        if(vm.viewSettlementTiles) protocols.settlementTiles = vm.settlementTiles;
        if(vm.viewWaterQuality) protocols.waterQuality = vm.waterQuality;

        $http.post('/api/expeditions/' + vm.expedition._id + '/submit?full=true', {
          protocols: protocols
        }).
        success(function(data, status, headers, config) {
          vm.expedition = data;
          if(vm.viewSiteCondition) vm.siteCondition.status = 'submitted';
          if(vm.viewOysterMeasurement) vm.oysterMeasurement.status = 'submitted';
          if(vm.viewMobileTrap) vm.mobileTrap.status = 'submitted';
          if(vm.viewSettlementTiles) vm.settlementTiles.status = 'submitted';
          if(vm.viewWaterQuality) vm.waterQuality.status = 'submitted';
          vm.submitting = false;
          vm.saving = true;
          $state.go('expeditions.view', {
            expeditionId: vm.expedition._id
          });
        }).
        error(function(data, status, headers, config) {
          vm.error = data.message;
          vm.submitting = false;
          vm.saving = true;
        });
      }
    };

    vm.submitTeamMember = function() {
      vm.submitting = true;
      vm.saving = false;

      if (vm.viewSiteCondition) $rootScope.$broadcast('saveSiteCondition');
      if (vm.viewOysterMeasurement) $rootScope.$broadcast('saveOysterMeasurement');
      if (vm.viewMobileTrap) $rootScope.$broadcast('saveMobileTrap');
      if (vm.viewSettlementTiles) $rootScope.$broadcast('saveSettlementTiles');
      if (vm.viewWaterQuality) $rootScope.$broadcast('saveWaterQuality');
    };

    vm.publish = function() {
      $http.post('/api/expeditions/' + vm.expedition._id + '/publish', {
      }).
      success(function(data, status, headers, config) {
        vm.expedition = data;
        if(vm.viewSiteCondition) vm.siteCondition.status = 'submitted';
        if(vm.viewOysterMeasurement) vm.oysterMeasurement.status = 'submitted';
        if(vm.viewMobileTrap) vm.mobileTrap.status = 'submitted';
        if(vm.viewSettlementTiles) vm.settlementTiles.status = 'submitted';
        if(vm.viewWaterQuality) vm.waterQuality.status = 'submitted';
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
      });
    };

    vm.return = function() {
      $http.post('/api/expeditions/' + vm.expedition._id + '/return?full=true', {
      }).
      success(function(data, status, headers, config) {
        vm.expedition = data;
        vm.siteCondition = vm.expedition.protocols.siteCondition;
        vm.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
        vm.mobileTrap = vm.expedition.protocols.mobileTrap;
        vm.settlementTiles = vm.expedition.protocols.settlementTiles;
        vm.waterQuality = vm.expedition.protocols.waterQuality;

        if(vm.viewSiteCondition) vm.siteCondition.status = 'incomplete';
        if(vm.viewOysterMeasurement) vm.oysterMeasurement.status = 'incomplete';
        if(vm.viewMobileTrap) vm.mobileTrap.status = 'incomplete';
        if(vm.viewSettlementTiles) vm.settlementTiles.status = 'incomplete';
        if(vm.viewWaterQuality) vm.waterQuality.status = 'incomplete';
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
      });
    };

    vm.unpublish = function() {
      $http.post('/api/expeditions/' + vm.expedition._id + '/unpublish', {
      }).
      success(function(data, status, headers, config) {
        vm.expedition = data;
        if(vm.viewSiteCondition) vm.siteCondition.status = 'incomplete';
        if(vm.viewOysterMeasurement) vm.oysterMeasurement.status = 'incomplete';
        if(vm.viewMobileTrap) vm.mobileTrap.status = 'incomplete';
        if(vm.viewSettlementTiles) vm.settlementTiles.status = 'incomplete';
        if(vm.viewWaterQuality) vm.waterQuality.status = 'incomplete';
      }).
      error(function(data, status, headers, config) {
        vm.error = data.message;
      });
    };

    $scope.$on('incrementalSaveSiteConditionSuccessful', function() {
      vm.tabs.protocol1.saveSuccessful = true;
    });

    $scope.$on('incrementalSaveOysterMeasurementSuccessful', function() {
      vm.tabs.protocol2.saveSuccessful = true;
    });

    $scope.$on('incrementalSaveMobileTrapSuccessful', function() {
      vm.tabs.protocol3.saveSuccessful = true;
    });

    $scope.$on('incrementalSaveSettlementTilesSuccessful', function() {
      vm.tabs.protocol4.saveSuccessful = true;
    });

    $scope.$on('incrementalSaveWaterQualitySuccessful', function() {
      vm.tabs.protocol5.saveSuccessful = true;
    });

    $scope.$on('incrementalSaveSiteConditionError', function() {
      vm.tabs.protocol1.saveSuccessful = false;
    });

    $scope.$on('incrementalSaveOysterMeasurementError', function() {
      vm.tabs.protocol2.saveSuccessful = false;
    });

    $scope.$on('incrementalSaveMobileTrapError', function() {
      vm.tabs.protocol3.saveSuccessful = false;
    });

    $scope.$on('incrementalSaveSettlementTilesError', function() {
      vm.tabs.protocol4.saveSuccessful = false;
    });

    $scope.$on('incrementalSaveWaterQualityError', function() {
      vm.tabs.protocol5.saveSuccessful = false;
    });

    $scope.$on('saveSiteConditionSuccessful', function() {
      vm.tabs.protocol1.saveSuccessful = true;
      vm.tabs.protocol1.submitSuccessful = true;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveOysterMeasurementSuccessful', function() {
      vm.tabs.protocol2.saveSuccessful = true;
      vm.tabs.protocol2.submitSuccessful = true;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveMobileTrapSuccessful', function() {
      vm.tabs.protocol3.saveSuccessful = true;
      vm.tabs.protocol3.submitSuccessful = true;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveSettlementTilesSuccessful', function() {
      vm.tabs.protocol4.saveSuccessful = true;
      vm.tabs.protocol4.submitSuccessful = true;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveWaterQualitySuccessful', function() {
      vm.tabs.protocol5.saveSuccessful = true;
      vm.tabs.protocol5.submitSuccessful = true;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveSiteConditionError', function() {
      vm.tabs.protocol1.saveSuccessful = false;
      vm.tabs.protocol1.submitSuccessful = false;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveOysterMeasurementError', function() {
      vm.tabs.protocol2.saveSuccessful = false;
      vm.tabs.protocol2.submitSuccessful = false;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveMobileTrapError', function() {
      vm.tabs.protocol3.saveSuccessful = false;
      vm.tabs.protocol3.submitSuccessful = false;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveSettlementTilesError', function() {
      vm.tabs.protocol4.saveSuccessful = false;
      vm.tabs.protocol4.submitSuccessful = false;
      checkAllSaveSuccessful();
    });

    $scope.$on('saveWaterQualityError', function() {
      vm.tabs.protocol5.saveSuccessful = false;
      vm.tabs.protocol5.submitSuccessful = false;
      checkAllSaveSuccessful();
    });

    vm.refreshTiles = function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    };

    $scope.$on('savingStart', function() {
      vm.saving = true;
      $timeout(function() {
        vm.saving = false;
      }, 1500);
    });
  }
})();
