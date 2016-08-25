(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionProtocolsController', ExpeditionProtocolsController);

  ExpeditionProtocolsController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'moment', 'lodash',
  '$timeout', '$interval', 'expeditionResolve', 'Authentication', 'TeamsService', 'TeamMembersService',
  'ExpeditionsService', 'ExpeditionActivitiesService', 'FileUploader'];

  function ExpeditionProtocolsController($scope, $rootScope, $state, $stateParams, $http, moment, lodash,
    $timeout, $interval, expedition, Authentication, TeamsService, TeamMembersService, ExpeditionsService,
    ExpeditionActivitiesService, FileUploader) {
    var vm = this;
    vm.expedition = expedition;
    vm.user = Authentication.user;
    vm.activeTab = 'protocol1';
    $scope.siteConditionErrors = '';
    $scope.oysterMeasurementErrors = '';
    $scope.mobileTrapErrors = '';
    $scope.settlementTilesErrors = '';
    $scope.waterQualityErrors = '';

    // Compare the passed in role to the user's roles
    var checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    var checkTeamLead = function() {
      return (checkRole('team lead') && vm.user.username === vm.team.teamLead.username) ? true : false;
    };

    var checkTeamMember = function() {
      if (checkRole('team member')) {
        var teamMemberIndex = lodash.findIndex(vm.team.teamMembers, function(m) {
          return m.username === vm.user.username;
        });
        return (teamMemberIndex > -1) ? true : false;
      } else {
        return false;
      }
    };

    // Get Team Info to display in header
    TeamsService.get({
      teamId: vm.expedition.team._id
    }, function(data) {
      vm.team = data;

      // Determine the users roles
      vm.isTeamLead = checkTeamLead();
      vm.isTeamMember = checkTeamMember();
      vm.isAdmin = checkRole('admin');
    });

    // Get the formatted Expedition date
    vm.getExpeditionDate = function() {
      return moment(vm.expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
    };

    // Get the formatted Expedition time range
    vm.getExpeditionTimeRange = function(expedition) {
      return moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm')+'-'+
        moment(expedition.monitoringEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm');
    };

    // Get the formatted date
    vm.getDate = function(date) {
      return moment(date).format('MMMM D, YYYY');
    };

    // Get the formatted date
    vm.getShortDate = function(date) {
      return moment(date).format('M/D/YY');
    };

    // Get the formatted time
    vm.getTime = function(date) {
      return moment(date).format('h:mma');
    };

    // Get the formatted date and time
    vm.getDateTime = function(date) {
      return moment(date).format('MMM D, YYYY, h:mma');
    };

    // Get the link to the Expedition, if the user is an Admin or Team Lead and the Expedition is Incomplete, Returned,
    // or Unpublished take the user to the Edit Expedition page, otherwise just show them the Expedition protocols.
    vm.expeditionLink = function(expedition) {
      return ((vm.isTeamLead || vm.isAdmin) && (expedition.status === 'incomplete' || expedition.status === 'returned' ||
        expedition.status === 'unpublished')) ?
      'expeditions.edit({ expeditionId: expedition._id })' :
      'expeditions.protocols({ expeditionId: expedition._id })';
    };

    // Check if the user is allows to write to the given protocol
    vm.checkWrite = function(teamList, protocol) {
      if (checkRole('admin') && !checkRole('team lead') && !checkRole('team member')) {
        return true;
      } else {
        if (checkRole('team lead') && (protocol.status !== 'incomplete' && protocol.status !== 'returned')) {
          return true;
        } else {
          var teamListIndex = lodash.findIndex(teamList, function(m) {
            return m.username === vm.user.username;
          });
          return (teamListIndex > -1) ? true : false;
        }
      }
    };

    // Check to see if the protocol tab should be disabled
    vm.checkDisabled = function(protocol) {
      if (checkRole('team lead') || checkRole('admin')) {
        return false;
      } else {
        return !(protocol.status === 'incomplete' || protocol.status === 'returned');
      }
    };

    var populateTeamMembers = function(list, callback) {
      var getTeamMember = function(index, done) {
        if (index < list.length) {
          TeamMembersService.get({
            memberId: list[index]
          }, function(data) {
            list[index] = data;
            getTeamMember(index+1, done);
          });
        } else {
          done();
        }
      };
      getTeamMember(0, function() {
        if (callback) callback();
      });
    };

    if (vm.expedition.status === 'published' &&
    vm.expedition.protocols.siteCondition.status === 'published' &&
    vm.expedition.protocols.oysterMeasurement.status === 'published' &&
    vm.expedition.protocols.mobileTrap.status === 'published' &&
    vm.expedition.protocols.settlementTiles.status === 'published' &&
    vm.expedition.protocols.waterQuality.status === 'published') {
      $scope.siteCondition = vm.expedition.protocols.siteCondition;
      vm.viewSiteCondition = true;
      vm.disabledSiteCondition = false;
      $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
      vm.viewOysterMeasurement = true;
      vm.disabledOysterMeasurement = false;
      $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
      vm.viewMobileTrap = true;
      vm.disabledMobileTrap = false;
      $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
      vm.viewSettlementTiles = true;
      vm.disabledSettlementTiles = false;
      $scope.waterQuality = vm.expedition.protocols.waterQuality;
      vm.viewWaterQuality = true;
      vm.disabledWaterQuality = false;

      populateTeamMembers($scope.siteCondition.teamMembers);
      populateTeamMembers($scope.oysterMeasurement.teamMembers);
      populateTeamMembers($scope.mobileTrap.teamMembers);
      populateTeamMembers($scope.settlementTiles.teamMembers);
      populateTeamMembers($scope.waterQuality.teamMembers);
    } else {
      // Set up Site Condition protocol variables
      if (!vm.checkDisabled(vm.expedition.protocols.siteCondition)) {
        $scope.siteCondition = vm.expedition.protocols.siteCondition;
        vm.viewSiteCondition = vm.checkWrite(vm.expedition.teamLists.siteCondition, $scope.siteCondition);
        vm.disabledSiteCondition = false;
      } else {
        $scope.siteCondition = null;
        vm.viewSiteCondition = false;
        vm.disabledSiteCondition = true;
      }

      // Set up Oyster Measurement protocol variables
      if (!vm.checkDisabled(vm.expedition.protocols.oysterMeasurement)) {
        $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
        vm.viewOysterMeasurement = vm.checkWrite(vm.expedition.teamLists.oysterMeasurement, $scope.oysterMeasurement);
        vm.disabledOysterMeasurement = false;
      } else {
        $scope.oysterMeasurement = null;
        vm.viewOysterMeasurement = false;
        vm.disabledOysterMeasurement = true;
      }

      // Set up Mobile Trap protocol variables
      if (!vm.checkDisabled(vm.expedition.protocols.mobileTrap)) {
        $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
        vm.viewMobileTrap = vm.checkWrite(vm.expedition.teamLists.mobileTrap, $scope.mobileTrap);
        vm.disabledMobileTrap = false;
      } else {
        $scope.mobileTrap = null;
        vm.viewMobileTrap = false;
        vm.disabledMobileTrap = true;
      }

      // Set up Settlement Tiles protocol variables
      if (!vm.checkDisabled(vm.expedition.protocols.settlementTiles)) {
        $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
        vm.viewSettlementTiles = vm.checkWrite(vm.expedition.teamLists.settlementTiles, $scope.settlementTiles);
        vm.disabledSettlementTiles = false;
      } else {
        $scope.settlementTiles = null;
        vm.viewSettlementTiles = false;
        vm.disabledSettlementTiles = true;
      }

      // Set up Water Quality protocol variables
      if (!vm.checkDisabled(vm.expedition.protocols.waterQuality)) {
        $scope.waterQuality = vm.expedition.protocols.waterQuality;
        vm.viewWaterQuality = vm.checkWrite(vm.expedition.teamLists.waterQuality, $scope.waterQuality);
        vm.disabledWaterQuality = false;
      } else {
        $scope.waterQuality = null;
        vm.viewWaterQuality = false;
        vm.disabledWaterQuality = true;
      }
    }

    // Set up variables used by the tab element
    vm.tabs = {
      protocol1: { isActive: false, visible: vm.viewSiteCondition, error: '', isDisabled: vm.disabledSiteCondition },
      protocol2: { isActive: false, visible: vm.viewOysterMeasurement, error: '', isDisabled: vm.disabledOysterMeasurement },
      protocol3: { isActive: false, visible: vm.viewMobileTrap, error: '', isDisabled: vm.disabledMobileTrap },
      protocol4: { isActive: false, visible: vm.viewSettlementTiles, error: '', isDisabled: vm.disabledSettlementTiles },
      protocol5: { isActive: false, visible: vm.viewWaterQuality, error: '', isDisabled: vm.disabledWaterQuality }
    };

    // Find the active tab, this is necessary for instances when the user can not view all of the tabs
    for (var key in vm.tabs) {
      if (vm.tabs[key].visible && !vm.tabs[key].isDisabled) {
        vm.tabs[key].isActive = true;
        vm.activeTab = key;
        break;
      }
    }

    // Called when the user switches between tabs
    vm.switchTabs = function(key) {
      vm.previousTab = vm.activeTab;
      vm.activeTab = key;
    };

    // Check the status of the protocols visible to the user to see if at least one is incomplete
    vm.checkStatusIncomplete = function() {
      var protocolsIncomplete = true;
      if (vm.viewSiteCondition && $scope.siteCondition && $scope.siteCondition.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewOysterMeasurement && $scope.oysterMeasurement && $scope.oysterMeasurement.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewMobileTrap && $scope.mobileTrap && $scope.mobileTrap.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewSettlementTiles && $scope.settlementTiles && $scope.settlementTiles.status !== 'incomplete') protocolsIncomplete = false;
      if (vm.viewWaterQuality && $scope.waterQuality && $scope.waterQuality.status !== 'incomplete') protocolsIncomplete = false;
      return vm.expedition.status === 'incomplete';// && protocolsIncomplete;
    };

    // Check the status of the protocols visible to the user to see if they are all submitted
    vm.checkStatusPending = function() {
      var protocolsSubmitted = true;
      if (vm.viewSiteCondition && $scope.siteCondition && $scope.siteCondition.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewOysterMeasurement && $scope.oysterMeasurement && $scope.oysterMeasurement.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewMobileTrap && $scope.mobileTrap && $scope.mobileTrap.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewSettlementTiles && $scope.settlementTiles && $scope.settlementTiles.status !== 'submitted') protocolsSubmitted = false;
      if (vm.viewWaterQuality && $scope.waterQuality && $scope.waterQuality.status !== 'submitted') protocolsSubmitted = false;
      return vm.expedition.status === 'pending';// || (protocolsSubmitted && vm.expedition.status !== 'published');
    };

    // Check the status of the protocols visible to the user to see if they are all returned
    vm.checkStatusReturned = function() {
      var protocolsReturned = true;
      if (vm.viewSiteCondition && $scope.siteCondition && $scope.siteCondition.status !== 'returned') protocolsReturned = false;
      if (vm.viewOysterMeasurement && $scope.oysterMeasurement && $scope.oysterMeasurement.status !== 'returned') protocolsReturned = false;
      if (vm.viewMobileTrap && $scope.mobileTrap && $scope.mobileTrap.status !== 'returned') protocolsReturned = false;
      if (vm.viewSettlementTiles && $scope.settlementTiles && $scope.settlementTiles.status !== 'returned') protocolsReturned = false;
      if (vm.viewWaterQuality && $scope.waterQuality && $scope.waterQuality.status !== 'returned') protocolsReturned = false;
      return vm.expedition.status === 'returned';// && protocolsReturned;
    };

    vm.checkAllSubmitted = function(status) {
      if (vm.viewSiteCondition && $scope.siteCondition && $scope.siteCondition.status === 'submitted' &&
          vm.viewOysterMeasurement && $scope.oysterMeasurement && $scope.oysterMeasurement.status === 'submitted' &&
          vm.viewMobileTrap && $scope.mobileTrap && $scope.mobileTrap.status === 'submitted' &&
          vm.viewSettlementTiles && $scope.settlementTiles && $scope.settlementTiles.status === 'submitted' &&
          vm.viewWaterQuality && $scope.waterQuality && $scope.waterQuality.status === 'submitted') {
        return true;
      } else {
        var submitted = 0;
        var published = 0;
        if (vm.viewSiteCondition && $scope.siteCondition) {
          if ($scope.siteCondition.status === 'submitted') submitted++;
          if ($scope.siteCondition.status === 'published') published++;
        }
        if (vm.viewOysterMeasurement && $scope.oysterMeasurement) {
          if ($scope.oysterMeasurement.status === 'submitted') submitted++;
          if ($scope.oysterMeasurement.status === 'published') published++;
        }
        if (vm.viewMobileTrap && $scope.mobileTrap) {
          if ($scope.mobileTrap.status === 'submitted') submitted++;
          if ($scope.mobileTrap.status === 'published') published++;
        }
        if (vm.viewSettlementTiles && $scope.settlementTiles) {
          if ($scope.settlementTiles.status === 'submitted') submitted++;
          if ($scope.settlementTiles.status === 'published') published++;
        }
        if (vm.viewWaterQuality && $scope.waterQuality) {
          if ($scope.waterQuality.status === 'submitted') submitted++;
          if ($scope.waterQuality.status === 'published') published++;
        }
        if (submitted > 0 && submitted + published === 5) {
          return true;
        } else {
          return false;
        }
      }
    };

    vm.checkAllStatus = function(status) {
      if (vm.viewSiteCondition && $scope.siteCondition && $scope.siteCondition.status === status &&
          vm.viewOysterMeasurement && $scope.oysterMeasurement && $scope.oysterMeasurement.status === status &&
          vm.viewMobileTrap && $scope.mobileTrap && $scope.mobileTrap.status === status &&
          vm.viewSettlementTiles && $scope.settlementTiles && $scope.settlementTiles.status === status &&
          vm.viewWaterQuality && $scope.waterQuality && $scope.waterQuality.status === status) {
        return true;
      } else {
        return false;
      }
    };

    // Checks to see if all of the visible protocols are valid
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

    // Check to see if all of the tabs have loaded
    vm.protocolsLoaded = function() {
      if (vm.saving === true) {
        console.log('protocols not loaded saving');
        return false;
      } else {
        console.log('vm.tabs.protocol1.saveSuccessful', vm.tabs.protocol1.saveSuccessful);
        var successful = true;

        if(vm.viewSiteCondition && vm.tabs.protocol1.saveSuccessful === undefined) successful = false;
        if(vm.viewOysterMeasurement && vm.tabs.protocol2.saveSuccessful === undefined) successful = false;
        if(vm.viewMobileTrap && vm.tabs.protocol3.saveSuccessful === undefined) successful = false;
        if(vm.viewSettlementTiles && vm.tabs.protocol4.saveSuccessful === undefined) successful = false;
        if(vm.viewWaterQuality && vm.tabs.protocol5.saveSuccessful === undefined) successful = false;

        return successful;
      }
    };

    vm.validateProtocols = function(callback) {
      var finishedSaving = 0;
      var allDone = function() {
        finishedSaving++;
        if (finishedSaving === 5) {
          callback();
        }
      };

      if(vm.viewSiteCondition && $scope.siteCondition) {
        $scope.validateSiteCondition(function() {
          vm.tabs.protocol1.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol1.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol1.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewOysterMeasurement && $scope.oysterMeasurement) {
        $scope.validateOysterMeasurement(function() {
          vm.tabs.protocol2.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol2.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol2.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewMobileTrap && $scope.mobileTrap) {
        $scope.validateMobileTrap(function() {
          vm.tabs.protocol3.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol3.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol3.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewSettlementTiles && $scope.settlementTiles) {
        $scope.validateSettlementTile(function() {
          vm.tabs.protocol4.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol4.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol4.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewWaterQuality && $scope.waterQuality) {
        $scope.validateWaterQuality(function() {
          vm.tabs.protocol5.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol5.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol5.saveSuccessful = undefined;
        allDone();
      }
    };

    vm.saveDraft = function() {
      vm.saving = true;

      var finishedSaving = 0;
      var allDone = function() {
        finishedSaving++;
        if (finishedSaving === 5) {
          vm.saving = false;
        }
      };

      if(vm.viewSiteCondition && $scope.siteCondition) {
        $scope.saveSiteCondition(function() {
          vm.tabs.protocol1.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol1.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol1.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewOysterMeasurement && $scope.oysterMeasurement) {
        $scope.saveOysterMeasurement(function() {
          vm.tabs.protocol2.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol2.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol2.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewMobileTrap && $scope.mobileTrap) {
        $scope.saveMobileTrap(function() {
          vm.tabs.protocol3.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol3.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol3.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewSettlementTiles && $scope.settlementTiles) {
        $scope.saveSettlementTile(function() {
          vm.tabs.protocol4.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol4.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol4.saveSuccessful = undefined;
        allDone();
      }

      if(vm.viewWaterQuality && $scope.waterQuality) {
        $scope.saveWaterQuality(function() {
          vm.tabs.protocol5.saveSuccessful = true;
          allDone();
        }, function() {
          vm.tabs.protocol5.saveSuccessful = false;
          allDone();
        });
      } else {
        vm.tabs.protocol5.saveSuccessful = undefined;
        allDone();
      }
    };

    // Submit the protocols as a team member
    vm.submitTeamMember = function() {
      vm.submitting = true;

      vm.validateProtocols(function() {
        if (vm.protocolsSuccessful()) {
          var protocols = {};
          if(vm.viewSiteCondition && $scope.siteCondition) protocols.siteCondition = $scope.siteCondition;
          if(vm.viewOysterMeasurement && $scope.oysterMeasurement) protocols.oysterMeasurement = $scope.oysterMeasurement;
          if(vm.viewMobileTrap && $scope.mobileTrap) protocols.mobileTrap = $scope.mobileTrap;
          if(vm.viewSettlementTiles && $scope.settlementTiles) protocols.settlementTiles = $scope.settlementTiles;
          if(vm.viewWaterQuality && $scope.waterQuality) protocols.waterQuality = $scope.waterQuality;

          console.log('protocols to submit', protocols);

          $http.post('/api/expeditions/' + vm.expedition._id + '/submit?full=true', {
            protocols: protocols
          }).
          success(function(data, status, headers, config) {
            vm.expedition = data;
            if(vm.viewSiteCondition) $scope.siteCondition = vm.expedition.protocols.siteCondition;
            if(vm.viewOysterMeasurement) $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
            if(vm.viewMobileTrap) $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
            if(vm.viewSettlementTiles) $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
            if(vm.viewWaterQuality) $scope.waterQuality = vm.expedition.protocols.waterQuality;
            vm.submitting = false;
            $state.go('expeditions.view', {
              expeditionId: vm.expedition._id
            });
          }).
          error(function(data, status, headers, config) {
            console.log('data', data);
            if (data && data.message) {
              vm.siteConditionErrors = data.message.siteCondition;
              vm.oysterMeasurementErrors = data.message.oysterMeasurement;
              vm.mobileTrapErrors = data.message.mobileTrap;
              vm.settlementTilesErrors = data.message.settlementTiles;
              vm.waterQualityErrors = data.message.waterQuality;
            }
            vm.submitting = false;
          });
        } else {
          vm.submitting = false;
        }
      });
    };

    // Publish the Expedition
    vm.publish = function() {
      vm.publishing = true;

      vm.validateProtocols(function() {
        if (vm.protocolsSuccessful()) {
          var protocols = {};
          if(vm.viewSiteCondition && $scope.siteCondition) protocols.siteCondition = $scope.siteCondition;
          if(vm.viewOysterMeasurement && $scope.oysterMeasurement) protocols.oysterMeasurement = $scope.oysterMeasurement;
          if(vm.viewMobileTrap && $scope.mobileTrap) protocols.mobileTrap = $scope.mobileTrap;
          if(vm.viewSettlementTiles && $scope.settlementTiles) protocols.settlementTiles = $scope.settlementTiles;
          if(vm.viewWaterQuality && $scope.waterQuality) protocols.waterQuality = $scope.waterQuality;

          $http.post('/api/expeditions/' + vm.expedition._id + '/publish', {
            protocols: protocols
          }).
          success(function(data, status, headers, config) {
            vm.expedition = data;
            if(vm.viewSiteCondition) $scope.siteCondition.status = 'published';
            if(vm.viewOysterMeasurement) $scope.oysterMeasurement.status = 'published';
            if(vm.viewMobileTrap) $scope.mobileTrap.status = 'published';
            if(vm.viewSettlementTiles) $scope.settlementTiles.status = 'published';
            if(vm.viewWaterQuality) $scope.waterQuality.status = 'published';
            vm.publishing = false;
            $state.go('expeditions.view', {
              expeditionId: vm.expedition._id
            });
          }).
          error(function(data, status, headers, config) {
            if (data && data.message) {
              vm.siteConditionErrors = data.message.siteCondition;
              vm.oysterMeasurementErrors = data.message.oysterMeasurement;
              vm.mobileTrapErrors = data.message.mobileTrap;
              vm.settlementTilesErrors = data.message.settlementTiles;
              vm.waterQualityErrors = data.message.waterQuality;
            }

            vm.publishing = false;
          });
        } else {
          vm.publishing = false;
        }
      });
    };

    // Return the Expedition
    vm.return = function() {
      vm.returning = true;

      var protocols = {};
      if(vm.viewSiteCondition && $scope.siteCondition) protocols.siteCondition = $scope.siteCondition;
      if(vm.viewOysterMeasurement && $scope.oysterMeasurement) protocols.oysterMeasurement = $scope.oysterMeasurement;
      if(vm.viewMobileTrap && $scope.mobileTrap) protocols.mobileTrap = $scope.mobileTrap;
      if(vm.viewSettlementTiles && $scope.settlementTiles) protocols.settlementTiles = $scope.settlementTiles;
      if(vm.viewWaterQuality && $scope.waterQuality) protocols.waterQuality = $scope.waterQuality;

      $http.post('/api/expeditions/' + vm.expedition._id + '/return?full=true', {
        protocols: protocols
      }).
      success(function(data, status, headers, config) {
        vm.expedition = data;
        $scope.siteCondition = vm.expedition.protocols.siteCondition;
        $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
        $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
        $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
        $scope.waterQuality = vm.expedition.protocols.waterQuality;

        if(vm.viewSiteCondition) $scope.siteCondition.status = 'returned';
        if(vm.viewOysterMeasurement) $scope.oysterMeasurement.status = 'returned';
        if(vm.viewMobileTrap) $scope.mobileTrap.status = 'returned';
        if(vm.viewSettlementTiles) $scope.settlementTiles.status = 'returned';
        if(vm.viewWaterQuality) $scope.waterQuality.status = 'returned';
        vm.returning = false;
        $state.go('expeditions.view', {
          expeditionId: vm.expedition._id
        });
      }).
      error(function(data, status, headers, config) {
        if (data && data.message) {
          vm.siteConditionErrors = data.message.siteCondition;
          vm.oysterMeasurementErrors = data.message.oysterMeasurement;
          vm.mobileTrapErrors = data.message.mobileTrap;
          vm.settlementTilesErrors = data.message.settlementTiles;
          vm.waterQualityErrors = data.message.waterQuality;
        }
        vm.returning = false;
      });
    };

    // Unpublish the Expedition
    vm.unpublish = function() {
      vm.unpublishing = true;

      var protocols = {};
      if(vm.viewSiteCondition && $scope.siteCondition) protocols.siteCondition = $scope.siteCondition;
      if(vm.viewOysterMeasurement && $scope.oysterMeasurement) protocols.oysterMeasurement = $scope.oysterMeasurement;
      if(vm.viewMobileTrap && $scope.mobileTrap) protocols.mobileTrap = $scope.mobileTrap;
      if(vm.viewSettlementTiles && $scope.settlementTiles) protocols.settlementTiles = $scope.settlementTiles;
      if(vm.viewWaterQuality && $scope.waterQuality) protocols.waterQuality = $scope.waterQuality;

      $http.post('/api/expeditions/' + vm.expedition._id + '/unpublish', {
        protocols: protocols
      }).
      success(function(data, status, headers, config) {
        console.log('unpublished');
        vm.expedition = data;
        if(vm.viewSiteCondition) $scope.siteCondition.status = 'unpublished';
        if(vm.viewOysterMeasurement) $scope.oysterMeasurement.status = 'unpublished';
        if(vm.viewMobileTrap) $scope.mobileTrap.status = 'unpublished';
        if(vm.viewSettlementTiles) $scope.settlementTiles.status = 'unpublished';
        if(vm.viewWaterQuality) $scope.waterQuality.status = 'unpublished';
        vm.unpublishing = false;
        $state.go('expeditions.view', {
          expeditionId: vm.expedition._id
        });
      }).
      error(function(data, status, headers, config) {
        console.log('error unpublishing');
        if (data && data.message) {
          vm.siteConditionErrors = data.message.siteCondition;
          vm.oysterMeasurementErrors = data.message.oysterMeasurement;
          vm.mobileTrapErrors = data.message.mobileTrap;
          vm.settlementTilesErrors = data.message.settlementTiles;
          vm.waterQualityErrors = data.message.waterQuality;
        }
        vm.unpublishing = false;
      });
    };

    // Refresh the tiles in Mobile Trap
    vm.refreshTiles = function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    };

    //============================
    // Set up values for Protocols
    //============================
    $scope.authentication = Authentication;
    $scope.form = {};

    // Team member select set up
    $scope.teamMemberSelectConfig = {
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

    // Date time for the meta data
    $scope.dateTime = {
      min: moment().subtract(1, 'year').toDate(),
      max: moment().add(1, 'year').toDate()
    };

    // Set up values for each protocol
    // Site Condition
    $scope.waterConditionUploader = new FileUploader({
      alias: 'newWaterConditionPicture',
    });

    $scope.landConditionUploader = new FileUploader({
      alias: 'newLandConditionPicture',
    });

    // Oyster Measurement
    // Set up substrate shells
    $scope.substrateCount = 10;
    $scope.liveShellCount = 45;
    $scope.cageConditionUploader = new FileUploader({
      alias: 'newOysterCageConditionPicture'
    });

    $scope.outerUploaders = [];
    $scope.innerUploaders = [];

    for (var k = 0; k < $scope.substrateCount; k++) {
      $scope.outerUploaders.push(new FileUploader({ alias: 'newOuterSubstratePicture' }));
      $scope.innerUploaders.push(new FileUploader({ alias: 'newInnerSubstratePicture' }));
    }

    // Mobile Traps

    // Settlement Tiles
    // Set up tiles and grids
    $scope.tileCount = 4;
    $scope.gridCount = 25;
    $scope.settlementTilePhotoUploaders = [];

    for (var j = 0; j < $scope.tileCount; j++) {
      $scope.settlementTilePhotoUploaders.push(new FileUploader({ alias: 'newSettlementTilePicture' }));
    }

    // Water Quality

  }
})();
