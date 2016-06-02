(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionProtocolsController', ExpeditionProtocolsController);

  ExpeditionProtocolsController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'moment', 'lodash',
  '$timeout', '$interval', 'expeditionResolve', 'Authentication', 'TeamsService', 'ProtocolMobileTrapsService',
  'ProtocolOysterMeasurementsService', 'ProtocolSettlementTilesService', 'ProtocolSiteConditionsService',
  'ProtocolWaterQualityService', 'ExpeditionsService', 'ExpeditionActivitiesService'];

  function ExpeditionProtocolsController($scope, $rootScope, $state, $stateParams, $http, moment, lodash,
    $timeout, $interval, expedition, Authentication, TeamsService, ProtocolMobileTrapsService,
    ProtocolOysterMeasurementsService, ProtocolSettlementTilesService, ProtocolSiteConditionsService,
    ProtocolWaterQualityService, ExpeditionsService, ExpeditionActivitiesService) {
    var vm = this;
    vm.expedition = expedition;
    vm.user = Authentication.user;
    vm.activeTab = 'protocol1';
    vm.siteConditionErrors = '';
    vm.oysterMeasurementErrors = '';
    vm.mobileTrapErrors = '';
    vm.settlementTilesErrors = '';
    vm.waterQualityErrors = '';

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

    vm.checkDisabled = function(protocol) {
      if (checkRole('team lead') || checkRole('admin')) {
        return false;
      } else {
        return !(protocol.status === 'incomplete' || protocol.status === 'returned');
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
        if (protocol && protocol !== null && !vm.checkDisabled(protocol)) {
          vm.siteCondition = protocol;
          vm.viewSiteCondition = vm.checkWrite(vm.expedition.teamLists.siteCondition);
          vm.disabledSiteCondition = false;
        } else {
          vm.siteCondition = null;
          vm.viewSiteCondition = false;
          vm.disabledSiteCondition = true;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.oysterMeasurement, vm.expedition.teamLists.oysterMeasurement,
      '/api/protocol-oyster-measurements/' + vm.expedition.protocols.oysterMeasurement._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null && !vm.checkDisabled(protocol)) {
          vm.oysterMeasurement = protocol;
          vm.viewOysterMeasurement = vm.checkWrite(vm.expedition.teamLists.oysterMeasurement);
          vm.disabledOysterMeasurement = false;
        } else {
          vm.oysterMeasurement = null;
          vm.viewOysterMeasurement = false;
          vm.disabledOysterMeasurement = true;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.mobileTrap, vm.expedition.teamLists.mobileTrap,
      '/api/protocol-mobile-traps/' + vm.expedition.protocols.mobileTrap._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null && !vm.checkDisabled(protocol)) {
          vm.mobileTrap = protocol;
          vm.viewMobileTrap = vm.checkWrite(vm.expedition.teamLists.mobileTrap);
          vm.disabledMobileTrap = false;
        } else {
          vm.mobileTrap = null;
          vm.viewMobileTrap = false;
          vm.disabledMobileTrap = true;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.settlementTiles, vm.expedition.teamLists.settlementTiles,
      '/api/protocol-settlement-tiles/' + vm.expedition.protocols.settlementTiles._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null && !vm.checkDisabled(protocol)) {
          vm.settlementTiles = protocol;
          vm.viewSettlementTiles = vm.checkWrite(vm.expedition.teamLists.settlementTiles);
          vm.disabledSettlementTiles = false;
        } else {
          vm.settlementTiles = null;
          vm.viewSettlementTiles = false;
          vm.disabledSettlementTiles = true;
        }
      });
    vm.setupInputValues(vm.expedition.protocols.waterQuality, vm.expedition.teamLists.waterQuality,
      '/api/protocol-water-quality/' + vm.expedition.protocols.waterQuality._id + '/incremental-save',
      function(protocol) {
        if (protocol && protocol !== null && !vm.checkDisabled(protocol)) {
          vm.waterQuality = protocol;
          vm.viewWaterQuality = vm.checkWrite(vm.expedition.teamLists.waterQuality);
          vm.disabledWaterQuality = false;
        } else {
          vm.waterQuality = null;
          vm.viewWaterQuality = false;
          vm.disabledWaterQuality = true;
        }
      });

    vm.tabs = {
      protocol1: { isActive: false, visible: vm.viewSiteCondition, error: '', isDisabled: vm.disabledSiteCondition },
      protocol2: { isActive: false, visible: vm.viewOysterMeasurement, error: '', isDisabled: vm.disabledOysterMeasurement },
      protocol3: { isActive: false, visible: vm.viewMobileTrap, error: '', isDisabled: vm.disabledMobileTrap },
      protocol4: { isActive: false, visible: vm.viewSettlementTiles, error: '', isDisabled: vm.disabledSettlementTiles },
      protocol5: { isActive: false, visible: vm.viewWaterQuality, error: '', isDisabled: vm.disabledWaterQuality }
    };

    for (var key in vm.tabs) {
      if (vm.tabs[key].visible && !vm.tabs[key].isDisabled) {
        vm.tabs[key].isActive = true;
        vm.activeTab = key;
        break;
      }
    }

    var activeProtocolCall = function() {
      switch(vm.activeTab) {
        case 'protocol1': return 'incrementalSaveSiteCondition';
        case 'protocol2': return 'incrementalSaveOysterMeasurement';
        case 'protocol3': return 'incrementalSaveMobileTrap';
        case 'protocol4': return 'incrementalSaveSettlementTiles';
        case 'protocol5': return 'incrementalSaveWaterQuality';
      }
    };

    var save;
    var stopIncrementalSavingLoop = function() {
      if(angular.isDefined(save)) {
        $interval.cancel(save);
        save = undefined;
      }
    };

    var showTabChanged = function(changes) {
      if (vm.isTeamMember === true) {
        var descriptions = [];
        for (var i = 0; i < changes.length; i++) {
          descriptions.push(
            'A team member just submitted your shared ' + changes[i].protocolName +
            '. This form has been sent to your team lead for review and is no longer editable.'
          );
          vm.tabs[changes[i].protocol].isDisabled = true;
          vm.tabs[changes[i].protocol].isActive = false;
          vm.tabs[changes[i].protocol].visible = false;
          console.log('vm.tabs[protocol]', vm.tabs[changes[i].protocol]);
        }
        vm.disableProtocolChanges = descriptions;

        for (var key in vm.tabs) {
          if (vm.tabs[key].visible && !vm.tabs[key].isDisabled) {
            vm.tabs[key].isActive = true;
            vm.activeTab = key;
            break;
          }
        }

        if (vm.disableProtocolChanges && vm.disableProtocolChanges.length > 0) {
          console.log('vm.disableProtocolChanges', vm.disableProtocolChanges);
          angular.element('#modal-remove-protocol-tab').modal('show');
        }
      }
    };

    var startIncrementalSavingLoop = function() {
      if (angular.isDefined(save)) return;

      save = $interval(function() {
        if (vm.checkStatusIncomplete() || vm.checkStatusPending() || vm.checkStatusReturned()) {
          vm.saving = true;
          var saveCall = activeProtocolCall();
          console.log('saveCall', saveCall);
          $rootScope.$broadcast(saveCall);

          ExpeditionsService.get({
            expeditionId: $stateParams.expeditionId,
            full: true
          }, function(data) {
            var changes = [];
            if (data.protocols.siteCondition.status === 'submitted' && vm.siteCondition.status !== 'submitted' &&
            vm.viewSiteCondition) {
              if (vm.isTeamMember === true) {
                changes.push({
                  scribeName: data.protocols.siteCondition.scribeMember.displayName,
                  protocolName: 'Site Conditions',
                  protocol: 'protocol1'
                });
                vm.viewSiteCondition = false;
              }
              vm.siteCondition = data.protocols.siteCondition;
              $rootScope.$broadcast('readSiteConditionFromScope');
            }
            if (data.protocols.oysterMeasurement.status === 'submitted' && vm.oysterMeasurement.status !== 'submitted' &&
            vm.viewOysterMeasurement) {
              if (vm.isTeamMember === true) {
                changes.push({
                  scribeName: data.protocols.oysterMeasurement.scribeMember.displayName,
                  protocolName: 'Oyster Measurements',
                  protocol: 'protocol2'
                });
                vm.viewOysterMeasurement = false;
              }
              vm.oysterMeasurement = data.protocols.oysterMeasurement;
              $rootScope.$broadcast('readOysterMeasurementFromScope');
            }
            if (data.protocols.mobileTrap.status === 'submitted' && vm.mobileTrap.status !== 'submitted' &&
            vm.viewMobileTrap) {
              if (vm.isTeamMember === true) {
                changes.push({
                  scribeName: data.protocols.mobileTrap.scribeMember.displayName,
                  protocolName: 'Mobile Trap',
                  protocol: 'protocol3'
                });
                vm.viewMobileTrap = false;
              }
              vm.mobileTrap = data.protocols.mobileTrap;
              $rootScope.$broadcast('readMobileTrapFromScope');
            }
            if (data.protocols.settlementTiles.status === 'submitted' && vm.settlementTiles.status !== 'submitted' &&
            vm.viewSettlementTiles) {
              if (vm.isTeamMember === true) {
                changes.push({
                  scribeName: data.protocols.settlementTiles.scribeMember.displayName,
                  protocolName: 'Settlement Tiles',
                  protocol: 'protocol4'
                });
                vm.viewSettlementTiles = false;
              }
              vm.settlementTiles = data.protocols.settlementTiles;
              $rootScope.$broadcast('readSettlementTilesFromScope');
            }
            if (data.protocols.waterQuality.status === 'submitted' && vm.waterQuality.status !== 'submitted' &&
            vm.viewWaterQuality) {
              if (vm.isTeamMember === true) {
                changes.push({
                  scribeName: data.protocols.waterQuality.scribeMember.displayName,
                  protocolName: 'Water Quality',
                  protocol: 'protocol5'
                });
                vm.viewWaterQuality = false;
              }
              vm.waterQuality = data.protocols.waterQuality;
              $rootScope.$broadcast('readWaterQualityFromScope');
            }
            if (vm.isTeamMember === true) {
              if (data.protocols.siteCondition.status === 'submitted' && data.protocols.oysterMeasurement.status === 'submitted' &&
              data.protocols.mobileTrap.status === 'submitted' && data.protocols.settlementTiles.status === 'submitted' &&
              data.protocols.waterQuality.status === 'submitted') {
                stopIncrementalSavingLoop();
                $state.go('expeditions.view', {
                  expeditionId: vm.expedition._id
                });
              } else {
                showTabChanged(changes);
              }
            }
          });
        } else {
          stopIncrementalSavingLoop();
        }
      }, 15000);
    };

    //stopSaving
    $scope.$on('stopIncrementalSavingLoop', function() {
      console.log('stopIncrementalSavingLoop');
      stopIncrementalSavingLoop();
    });

    //startSaving
    $scope.$on('startIncrementalSavingLoop', function() {
      console.log('startIncrementalSavingLoop');
      startIncrementalSavingLoop();
    });

    vm.switchTabs = function(key) {
      vm.previousTab = vm.activeTab;
      var currentProtocol = activeProtocolCall();
      $rootScope.$broadcast(currentProtocol);
      vm.activeTab = key;
      var nextProtocol = activeProtocolCall();
      $rootScope.$broadcast(nextProtocol);
    };

    vm.checkStatusIncomplete = function() {
      var protocolsIncomplete = true;
      if (vm.viewSiteCondition && vm.siteCondition.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewOysterMeasurement && vm.oysterMeasurement.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewMobileTrap && vm.mobileTrap.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewSettlementTiles && vm.settlementTiles.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewWaterQuality && vm.waterQuality.status !== 'incomplete') protocolsIncomplete = false;
      return vm.expedition.status === 'incomplete';// && protocolsIncomplete;
    };

    vm.checkStatusPending = function() {
      var protocolsSubmitted = true;
      if (vm.viewSiteCondition && vm.siteCondition.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewOysterMeasurement && vm.oysterMeasurement.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewMobileTrap && vm.mobileTrap.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewSettlementTiles && vm.settlementTiles.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewWaterQuality && vm.waterQuality.status !== 'submitted') protocolsSubmitted = false;
      return vm.expedition.status === 'pending';// || (protocolsSubmitted && vm.expedition.status !== 'published');
    };

    vm.checkStatusReturned = function() {
      var protocolsReturned = true;
      if (vm.viewSiteCondition && vm.siteCondition.status !== 'returned') protocolsReturned = false;
      if (vm.viewOysterMeasurement && vm.oysterMeasurement.status !== 'returned') protocolsReturned = false;
      if (vm.viewMobileTrap && vm.mobileTrap.status !== 'returned') protocolsReturned = false;
      if (vm.viewSettlementTiles && vm.settlementTiles.status !== 'returned') protocolsReturned = false;
      if (vm.viewWaterQuality && vm.waterQuality.status !== 'returned') protocolsReturned = false;
      return vm.expedition.status === 'returned';// && protocolsReturned;
    };

    vm.protocolsSuccessful = function() {
      if (vm.saving === true) {
        return false;
      } else {
        var successful = true;

        if(vm.viewSiteCondition && !vm.tabs.protocol1.saveSuccessful) successful = false;
        if(vm.viewOysterMeasurement && !vm.tabs.protocol2.saveSuccessful) successful = false;
        if(vm.viewMobileTrap && !vm.tabs.protocol3.saveSuccessful) successful = false;
        if(vm.viewSettlementTiles && !vm.tabs.protocol4.saveSuccessful) successful = false;
        if(vm.viewWaterQuality && !vm.tabs.protocol5.saveSuccessful) successful = false;

        return successful;
      }
    };

    vm.protocolsLoaded = function() {
      if (vm.saving === true) {
        return false;
      } else {
        var successful = true;

        if(vm.viewSiteCondition && vm.tabs.protocol1.saveSuccessful !== true &&
          vm.tabs.protocol1.saveSuccessful !== false) successful = false;
        if(vm.viewOysterMeasurement && vm.tabs.protocol2.saveSuccessful !== true &&
          vm.tabs.protocol2.saveSuccessful !== false) successful = false;
        if(vm.viewMobileTrap && vm.tabs.protocol3.saveSuccessful !== true &&
          vm.tabs.protocol3.saveSuccessful !== false) successful = false;
        if(vm.viewSettlementTiles && vm.tabs.protocol4.saveSuccessful !== true &&
          vm.tabs.protocol4.saveSuccessful !== false) successful = false;
        if(vm.viewWaterQuality && vm.tabs.protocol5.saveSuccessful !== true &&
          vm.tabs.protocol5.saveSuccessful !== false) successful = false;

        return successful;
      }
    };

    var waitWhileSaving = function() {
      var wait = function() {
        console.log('waiting to finish saving');
      };

      while(vm.saving === true) {
        $timeout(wait, 3000);
      }
    };

    vm.submitTeamMember = function() {
      $rootScope.$broadcast('saveValuesToScope');
      waitWhileSaving();
      vm.submitting = true;
      vm.saving = false;
      stopIncrementalSavingLoop();

      $timeout(function() {
        if (vm.protocolsSuccessful()) {
          var protocols = {};
          if(vm.viewSiteCondition && vm.siteCondition) protocols.siteCondition = vm.siteCondition;
          if(vm.viewOysterMeasurement && vm.oysterMeasurement) protocols.oysterMeasurement = vm.oysterMeasurement;
          if(vm.viewMobileTrap && vm.mobileTrap) protocols.mobileTrap = vm.mobileTrap;
          if(vm.viewSettlementTiles && vm.settlementTiles) protocols.settlementTiles = vm.settlementTiles;
          if(vm.viewWaterQuality && vm.waterQuality) protocols.waterQuality = vm.waterQuality;

          console.log('protocols to submit', protocols);

          $http.post('/api/expeditions/' + vm.expedition._id + '/submit?full=true', {
            protocols: protocols
          }).
          success(function(data, status, headers, config) {
            vm.expedition = data;
            if(vm.viewSiteCondition) vm.siteCondition = vm.expedition.protocols.siteCondition;
            if(vm.viewOysterMeasurement) vm.oysterMeasurement = vm.expedition.protocols.oysterMeasurment;
            if(vm.viewMobileTrap) vm.mobileTrap = vm.expedition.protocols.mobileTrap;
            if(vm.viewSettlementTiles) vm.settlementTiles = vm.expedition.protocols.settlementTiles;
            if(vm.viewWaterQuality) vm.waterQuality = vm.expedition.protocols.waterQuality;
            vm.submitting = false;
            $state.go('expeditions.view', {
              expeditionId: vm.expedition._id
            });
          }).
          error(function(data, status, headers, config) {
            console.log('data', data);
            if (data && data.message) {
              vm.siteConditionErrors = data.message.siteCondition;
              vm.oysterMeasurmentErrors = data.message.oysterMeasurment;
              vm.mobileTrapErrors = data.message.mobileTrap;
              vm.settlementTilesErrors = data.message.settlementTiles;
              vm.waterQualityErrors = data.message.waterQuality;
            }
            vm.submitting = false;
            startIncrementalSavingLoop();
          });
        } else {
          vm.submitting = false;
          startIncrementalSavingLoop();
        }
      }, 5000);
    };

    vm.publish = function() {
      $rootScope.$broadcast('saveValuesToScope');
      waitWhileSaving();
      vm.saving = false;
      vm.publishing = true;
      stopIncrementalSavingLoop();

      $timeout(function() {
        if (vm.protocolsSuccessful()) {
          var protocols = {};
          if(vm.viewSiteCondition && vm.siteCondition) protocols.siteCondition = vm.siteCondition;
          if(vm.viewOysterMeasurement && vm.oysterMeasurement) protocols.oysterMeasurement = vm.oysterMeasurement;
          if(vm.viewMobileTrap && vm.mobileTrap) protocols.mobileTrap = vm.mobileTrap;
          if(vm.viewSettlementTiles && vm.settlementTiles) protocols.settlementTiles = vm.settlementTiles;
          if(vm.viewWaterQuality && vm.waterQuality) protocols.waterQuality = vm.waterQuality;

          $http.post('/api/expeditions/' + vm.expedition._id + '/publish', {
            protocols: protocols
          }).
          success(function(data, status, headers, config) {
            vm.expedition = data;
            if(vm.viewSiteCondition) vm.siteCondition.status = 'published';
            if(vm.viewOysterMeasurement) vm.oysterMeasurement.status = 'published';
            if(vm.viewMobileTrap) vm.mobileTrap.status = 'published';
            if(vm.viewSettlementTiles) vm.settlementTiles.status = 'published';
            if(vm.viewWaterQuality) vm.waterQuality.status = 'published';
            vm.publishing = false;
            $state.go('expeditions.view', {
              expeditionId: vm.expedition._id
            });
          }).
          error(function(data, status, headers, config) {
            if (data && data.message) {
              vm.siteConditionErrors = data.message.siteCondition;
              vm.oysterMeasurmentErrors = data.message.oysterMeasurment;
              vm.mobileTrapErrors = data.message.mobileTrap;
              vm.settlementTilesErrors = data.message.settlementTiles;
              vm.waterQualityErrors = data.message.waterQuality;
            }

            startIncrementalSavingLoop();
            vm.publishing = false;
          });
        } else {
          startIncrementalSavingLoop();
          vm.publishing = false;
        }
      }, 5000);
    };

    vm.return = function() {
      $rootScope.$broadcast('saveValuesToScope');
      waitWhileSaving();
      vm.saving = false;
      vm.returning = true;
      stopIncrementalSavingLoop();

      $timeout(function() {
        if (vm.protocolsLoaded()) {
          var protocols = {};
          if(vm.viewSiteCondition && vm.siteCondition) protocols.siteCondition = vm.siteCondition;
          if(vm.viewOysterMeasurement && vm.oysterMeasurement) protocols.oysterMeasurement = vm.oysterMeasurement;
          if(vm.viewMobileTrap && vm.mobileTrap) protocols.mobileTrap = vm.mobileTrap;
          if(vm.viewSettlementTiles && vm.settlementTiles) protocols.settlementTiles = vm.settlementTiles;
          if(vm.viewWaterQuality && vm.waterQuality) protocols.waterQuality = vm.waterQuality;

          $http.post('/api/expeditions/' + vm.expedition._id + '/return?full=true', {
            protocols: protocols
          }).
          success(function(data, status, headers, config) {
            vm.expedition = data;
            vm.siteCondition = vm.expedition.protocols.siteCondition;
            vm.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
            vm.mobileTrap = vm.expedition.protocols.mobileTrap;
            vm.settlementTiles = vm.expedition.protocols.settlementTiles;
            vm.waterQuality = vm.expedition.protocols.waterQuality;

            if(vm.viewSiteCondition) vm.siteCondition.status = 'returned';
            if(vm.viewOysterMeasurement) vm.oysterMeasurement.status = 'returned';
            if(vm.viewMobileTrap) vm.mobileTrap.status = 'returned';
            if(vm.viewSettlementTiles) vm.settlementTiles.status = 'returned';
            if(vm.viewWaterQuality) vm.waterQuality.status = 'returned';
            vm.returning = false;
            $state.go('expeditions.view', {
              expeditionId: vm.expedition._id
            });
          }).
          error(function(data, status, headers, config) {
            if (data && data.message) {
              vm.siteConditionErrors = data.message.siteCondition;
              vm.oysterMeasurmentErrors = data.message.oysterMeasurment;
              vm.mobileTrapErrors = data.message.mobileTrap;
              vm.settlementTilesErrors = data.message.settlementTiles;
              vm.waterQualityErrors = data.message.waterQuality;
            }
            startIncrementalSavingLoop();
            vm.returning = false;
          });
        } else {
          startIncrementalSavingLoop();
          vm.returning = false;
        }
      }, 5000);
    };

    vm.unpublish = function() {
      $rootScope.$broadcast('saveValuesToScope');
      waitWhileSaving();
      vm.saving = false;
      vm.unpublishing = true;
      stopIncrementalSavingLoop();

      $timeout(function() {
        if (vm.protocolsLoaded()) {
          var protocols = {};
          if(vm.viewSiteCondition && vm.siteCondition) protocols.siteCondition = vm.siteCondition;
          if(vm.viewOysterMeasurement && vm.oysterMeasurement) protocols.oysterMeasurement = vm.oysterMeasurement;
          if(vm.viewMobileTrap && vm.mobileTrap) protocols.mobileTrap = vm.mobileTrap;
          if(vm.viewSettlementTiles && vm.settlementTiles) protocols.settlementTiles = vm.settlementTiles;
          if(vm.viewWaterQuality && vm.waterQuality) protocols.waterQuality = vm.waterQuality;

          $http.post('/api/expeditions/' + vm.expedition._id + '/unpublish', {
            protocols: protocols
          }).
          success(function(data, status, headers, config) {
            vm.expedition = data;
            if(vm.viewSiteCondition) vm.siteCondition.status = 'unpublished';
            if(vm.viewOysterMeasurement) vm.oysterMeasurement.status = 'unpublished';
            if(vm.viewMobileTrap) vm.mobileTrap.status = 'unpublished';
            if(vm.viewSettlementTiles) vm.settlementTiles.status = 'unpublished';
            if(vm.viewWaterQuality) vm.waterQuality.status = 'unpublished';
            vm.unpublishing = false;
            $state.go('expeditions.view', {
              expeditionId: vm.expedition._id
            });
          }).
          error(function(data, status, headers, config) {
            if (data && data.message) {
              vm.siteConditionErrors = data.message.siteCondition;
              vm.oysterMeasurmentErrors = data.message.oysterMeasurment;
              vm.mobileTrapErrors = data.message.mobileTrap;
              vm.settlementTilesErrors = data.message.settlementTiles;
              vm.waterQualityErrors = data.message.waterQuality;
            }
            startIncrementalSavingLoop();
            vm.unpublishing = false;
          });
        } else {
          startIncrementalSavingLoop();
          vm.unpublishing = false;
        }
      }, 5000);
    };

    $scope.$on('incrementalSaveSiteConditionSuccessful', function() {
      vm.tabs.protocol1.saveSuccessful = true;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveOysterMeasurementSuccessful', function() {
      vm.tabs.protocol2.saveSuccessful = true;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveMobileTrapSuccessful', function() {
      vm.tabs.protocol3.saveSuccessful = true;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveSettlementTilesSuccessful', function() {
      vm.tabs.protocol4.saveSuccessful = true;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveWaterQualitySuccessful', function() {
      vm.tabs.protocol5.saveSuccessful = true;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveSiteConditionError', function() {
      vm.tabs.protocol1.saveSuccessful = false;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveOysterMeasurementError', function() {
      vm.tabs.protocol2.saveSuccessful = false;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveMobileTrapError', function() {
      vm.tabs.protocol3.saveSuccessful = false;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveSettlementTilesError', function() {
      vm.tabs.protocol4.saveSuccessful = false;
      vm.savingOff();
    });

    $scope.$on('incrementalSaveWaterQualityError', function() {
      vm.tabs.protocol5.saveSuccessful = false;
      vm.savingOff();
    });

    vm.refreshTiles = function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    };

    vm.savingOff = function() {
      $timeout(function() {
        vm.saving = false;
      }, 1500);
    };

    $scope.$on('savingStart', function() {
      if (vm.checkStatusIncomplete() || vm.checkStatusPending() || vm.checkStatusReturned()) {
        vm.saving = true;
        stopIncrementalSavingLoop();
      }
    });

    $scope.$on('savingStop', function() {
      vm.savingOff();
      startIncrementalSavingLoop();
    });

    $scope.$on('removeSubmittedProtocolTab', function(event, args) {
      var changes = [{
        scribeName: args.values.scribeName,
        protocolName: args.values.protocolName,
        protocol: args.values.protocol
      }];
      showTabChanged(changes);
      vm.savingOff();
      startIncrementalSavingLoop();
    });

    $scope.$on('$locationChangeStart', function(event) {
      stopIncrementalSavingLoop();
    });
  }
})();
