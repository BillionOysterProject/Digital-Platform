(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionProtocolsController', ExpeditionProtocolsController);

  ExpeditionProtocolsController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'moment', 'lodash',
    '$timeout', '$interval', 'expeditionResolve', 'Authentication', 'TeamsService', 'TeamMembersService', 'Admin',
    'ExpeditionsService', 'ExpeditionActivitiesService', 'FileUploader', 'ExpeditionViewHelper', 'RestorationStationsService'];

  function ExpeditionProtocolsController($scope, $rootScope, $state, $stateParams, $http, moment, lodash,
    $timeout, $interval, expedition, Authentication, TeamsService, TeamMembersService, Admin,
    ExpeditionsService, ExpeditionActivitiesService, FileUploader, ExpeditionViewHelper, RestorationStationsService) {
    var vm = this;
    var stopListeningForStateChangeStart;
    vm.expedition = expedition;
    vm.user = Authentication.user;
    vm.activeTab = 'protocol1';
    $scope.siteConditionErrors = '';
    $scope.oysterMeasurementErrors = '';
    $scope.mobileTrapErrors = '';
    $scope.settlementTilesErrors = '';
    $scope.waterQualityErrors = '';
    $scope.userToView = {};

    vm.active = '';
    if (vm.expedition && vm.expedition.protocols) {
      if (vm.expedition.protocols.siteCondition) {
        vm.active = 'siteCondition';
      } else if (vm.expedition.protocols.oysterMeasurement) {
        vm.active = 'oysterMeasurement';
      } else if (vm.expedition.protocols.mobileTrap) {
        vm.active = 'mobileTrap';
      } else if (vm.expedition.protocols.settlementTiles) {
        vm.active = 'settlementTiles';
      } else if (vm.expedition.protocols.waterQuality) {
        vm.active = 'waterQuality';
      }
    }

    // Compare the passed in role to the user's roles
    var checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    var checkTeamLead = function() {
      if (checkRole('team lead')) {
        var teamLeadIndex = lodash.findIndex(vm.team.teamLeads, function(l) {
          return l.username === vm.user.username;
        });
        return (teamLeadIndex > -1) ? true : false;
      } else {
        return false;
      }
    };

    var checkTeamMember = function() {
      if (checkRole('team member') || checkRole('team lead')) {
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
    vm.getExpeditionDate = ExpeditionViewHelper.getExpeditionDate;

    // Get the formatted Expedition time range
    vm.getExpeditionTimeRange = ExpeditionViewHelper.getExpeditionTimeRange;

    // Get the formatted date
    vm.getDate = ExpeditionViewHelper.getDate;

    // Get the formatted date
    vm.getShortDate = ExpeditionViewHelper.getShortDate;

    // Get the formatted time
    vm.getTime = ExpeditionViewHelper.getTime;

    // Get the formatted date and time
    vm.getDateTime = ExpeditionViewHelper.getDateTime;

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
      if (protocol) {
        if (checkRole('admin')) {
          return true;
        } else {

          if (checkRole('team lead') && (protocol.status !== 'incomplete' && protocol.status !== 'returned')) {
            return true;
          } else {
            if (teamList && teamList.length > 0) {
              var teamListIndex = lodash.findIndex(teamList, function(m) {
                return m.username === vm.user.username;
              });
              return (teamListIndex > -1) ? true : false;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    };

    // Check to see if the protocol tab should be disabled
    vm.checkDisabled = function(protocol) {
      if (protocol) {
        if (checkRole('team lead') || checkRole('admin')) {
          return false;
        } else {
          return !(protocol.status === 'incomplete' || protocol.status === 'returned');
        }
      } else {
        return true;
      }
    };

    var populateTeamMembers = function(list, callback) {
      var getTeamMember = function(index, done) {
        if (index < list.length) {
          TeamMembersService.get({
            memberId: (list[index] && list[index]._id) ? list[index]._id : list[index]
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
    (!vm.expedition.protocols.siteCondition || vm.expedition.protocols.siteCondition.status === 'published') &&
    (!vm.expedition.protocols.oysterMeasurement || vm.expedition.protocols.oysterMeasurement.status === 'published') &&
    (!vm.expedition.protocols.mobileTrap || vm.expedition.protocols.mobileTrap.status === 'published') &&
    (!vm.expedition.protocols.settlementTiles || vm.expedition.protocols.settlementTiles.status === 'published') &&
    (!vm.expedition.protocols.waterQuality || vm.expedition.protocols.waterQuality.status === 'published')) {
      if (vm.expedition.protocols.siteCondition) {
        $scope.siteCondition = vm.expedition.protocols.siteCondition;
        vm.viewSiteCondition = true;
        vm.disabledSiteCondition = false;
        populateTeamMembers($scope.siteCondition.teamMembers);
      } else {
        $scope.siteCondition = null;
        vm.viewSiteCondition = false;
        vm.disabledSiteCondition = true;
      }
      if (vm.expedition.protocols.oysterMeasurement) {
        $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
        vm.viewOysterMeasurement = true;
        vm.disabledOysterMeasurement = false;
        populateTeamMembers($scope.oysterMeasurement.teamMembers);
      } else {
        $scope.oysterMeasurement = null;
        vm.viewOysterMeasurement = false;
        vm.disabledOysterMeasurement = true;
      }
      if (vm.expedition.protocols.mobileTrap) {
        $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
        vm.viewMobileTrap = true;
        vm.disabledMobileTrap = false;
        populateTeamMembers($scope.mobileTrap.teamMembers);
      } else {
        $scope.mobileTrap = null;
        vm.viewMobileTrap = false;
        vm.disabledMobileTrap = true;
      }
      if (vm.expedition.protocols.settlementTiles) {
        $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
        vm.viewSettlementTiles = true;
        vm.disabledSettlementTiles = false;
        populateTeamMembers($scope.settlementTiles.teamMembers);
      } else {
        $scope.settlementTiles = null;
        vm.viewSettlementTiles = false;
        vm.disabledSettlementTiles = true;
      }
      if (vm.expedition.protocols.waterQuality) {
        $scope.waterQuality = vm.expedition.protocols.waterQuality;
        vm.viewWaterQuality = true;
        vm.disabledWaterQuality = false;
        populateTeamMembers($scope.waterQuality.teamMembers);
      } else {
        $scope.waterQuality = null;
        vm.viewWaterQuality = false;
        vm.disabledWaterQuality = true;
      }
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

    $scope.station = vm.expedition.station;
    $scope.station.baselinesArray = new Array(10);
    // Get latest baseline history for each substrate shell
    for (var i = 1; i <= 10; i++) {
      var baselines = $scope.station.baselines['substrateShell'+i];
      $scope.station.baselinesArray[i-1] = (baselines && baselines.length > 0) ?
        baselines[baselines.length - 1] : {};
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
      return ExpeditionViewHelper.checkStatusIncomplete(vm.expedition);
    };

    // Check the status of the protocols visible to the user to see if they are all submitted
    vm.checkStatusPending = function() {
      return ExpeditionViewHelper.checkStatusPending(vm.expedition);
    };

    // Check the status of the protocols visible to the user to see if they are all returned
    vm.checkStatusReturned = function() {
      return ExpeditionViewHelper.checkStatusReturned(vm.expedition);
    };

    vm.checkStatusUnpublished = function() {
      return ExpeditionViewHelper.checkStatusUnpublished(vm.expedition);
    };

    vm.checkAllSubmitted = function(status) {
      if ((!$scope.siteCondition || (vm.viewSiteCondition && $scope.siteCondition.status === 'submitted')) &&
          (!$scope.oysterMeasurement || (vm.viewOysterMeasurement && $scope.oysterMeasurement.status === 'submitted')) &&
          (!$scope.mobileTrap || (vm.viewMobileTrap && $scope.mobileTrap.status === 'submitted')) &&
          (!$scope.settlementTiles || (vm.viewSettlementTiles && $scope.settlementTiles.status === 'submitted')) &&
          (!$scope.waterQuality || (vm.viewWaterQuality && $scope.waterQuality.status === 'submitted'))) {
        return true;
      } else {
        var submitted = 0;
        var published = 0;
        var skipped = 0;
        if (vm.viewSiteCondition && $scope.siteCondition) {
          if ($scope.siteCondition.status === 'submitted') submitted++;
          if ($scope.siteCondition.status === 'published') published++;
        }
        if (!vm.viewSiteCondition && !$scope.siteCondition) skipped++;
        if (vm.viewOysterMeasurement && $scope.oysterMeasurement) {
          if ($scope.oysterMeasurement.status === 'submitted') submitted++;
          if ($scope.oysterMeasurement.status === 'published') published++;
        }
        if (!vm.viewOysterMeasurement && !$scope.oysterMeasurement) skipped++;
        if (vm.viewMobileTrap && $scope.mobileTrap) {
          if ($scope.mobileTrap.status === 'submitted') submitted++;
          if ($scope.mobileTrap.status === 'published') published++;
        }
        if (!vm.viewMobileTrap && !$scope.mobileTrap) skipped++;
        if (vm.viewSettlementTiles && $scope.settlementTiles) {
          if ($scope.settlementTiles.status === 'submitted') submitted++;
          if ($scope.settlementTiles.status === 'published') published++;
        }
        if (!vm.viewSettlementTiles && !$scope.settlementTiles) skipped++;
        if (vm.viewWaterQuality && $scope.waterQuality) {
          if ($scope.waterQuality.status === 'submitted') submitted++;
          if ($scope.waterQuality.status === 'published') published++;
        }
        if (!vm.viewWaterQuality && !$scope.waterQuality) skipped++;
        if (submitted > 0 && (submitted + published + skipped === 5)) {
          return true;
        } else {
          return false;
        }
      }
    };

    vm.checkAllStatus = function(status) {
      if ((!$scope.siteCondition || (vm.viewSiteCondition && $scope.siteCondition.status === status)) &&
          (!$scope.oysterMeasurement || (vm.viewOysterMeasurement && $scope.oysterMeasurement.status === status)) &&
          (!$scope.mobileTrap || (vm.viewMobileTrap && $scope.mobileTrap.status === status)) &&
          (!$scope.settlementTiles || (vm.viewSettlementTiles && $scope.settlementTiles.status === status)) &&
          (!$scope.waterQuality || (vm.viewWaterQuality && $scope.waterQuality.status === status))) {
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
        return false;
      } else {
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

    vm.saveDraft = function(callback) {
      vm.saving = true;
      $scope.finishedSaving = 0;
      $scope.savingStatus = 'Saving';

      function saveDraftSiteCondition(saveCallback) {
        if(vm.viewSiteCondition && $scope.siteCondition) {
          $scope.savingStatus = 'Saving Site Condition';
          $scope.saveSiteCondition(function() {
            vm.tabs.protocol1.saveSuccessful = true;
            saveCallback();
          }, function() {
            vm.tabs.protocol1.saveSuccessful = false;
            saveCallback();
          });
        } else {
          vm.tabs.protocol1.saveSuccessful = undefined;
          saveCallback();
        }
      }

      function saveDraftOysterMeasurement(saveCallback) {
        if(vm.viewOysterMeasurement && $scope.oysterMeasurement) {
          $scope.savingStatus = 'Saving Oyster Measurement';
          $scope.saveOysterMeasurement(function() {
            vm.tabs.protocol2.saveSuccessful = true;
            saveCallback();
          }, function() {
            vm.tabs.protocol2.saveSuccessful = false;
            saveCallback();
          });
        } else {
          vm.tabs.protocol2.saveSuccessful = undefined;
          saveCallback();
        }
      }

      function saveDraftMobileTrap(saveCallback) {
        if(vm.viewMobileTrap && $scope.mobileTrap) {
          $scope.savingStatus = 'Saving Mobile Trap';
          $scope.saveMobileTrap(function() {
            vm.tabs.protocol3.saveSuccessful = true;
            saveCallback();
          }, function() {
            vm.tabs.protocol3.saveSuccessful = false;
            saveCallback();
          });
        } else {
          vm.tabs.protocol3.saveSuccessful = undefined;
          saveCallback();
        }
      }

      function saveDraftSettlementTiles(saveCallback) {
        if(vm.viewSettlementTiles && $scope.settlementTiles) {
          $scope.savingStatus = 'Saving Settlement Tiles';
          $scope.saveSettlementTile(function() {
            vm.tabs.protocol4.saveSuccessful = true;
            saveCallback();
          }, function() {
            vm.tabs.protocol4.saveSuccessful = false;
            saveCallback();
          });
        } else {
          vm.tabs.protocol4.saveSuccessful = undefined;
          saveCallback();
        }
      }

      function saveDraftWaterQuality(saveCallback) {
        if(vm.viewWaterQuality && $scope.waterQuality) {
          $scope.savingStatus = 'Saving Water Quality';
          $scope.saveWaterQuality(function() {
            vm.tabs.protocol5.saveSuccessful = true;
            saveCallback();
          }, function() {
            vm.tabs.protocol5.saveSuccessful = false;
            saveCallback();
          });
        } else {
          vm.tabs.protocol5.saveSuccessful = undefined;
          saveCallback();
        }
      }

      angular.element('#modal-save-draft-progress-bar').modal('show');
      $timeout(function () {
        saveDraftSiteCondition(function () {
          $scope.finishedSaving = 20;
          $timeout(function() {
            saveDraftOysterMeasurement(function() {
              $scope.finishedSaving = 40;
              $timeout(function () {
                saveDraftMobileTrap(function() {
                  $scope.finishedSaving = 60;
                  $timeout(function () {
                    saveDraftSettlementTiles(function() {
                      $scope.finishedSaving = 80;
                      $timeout(function () {
                        saveDraftWaterQuality(function() {
                          $scope.finishedSaving = 100;
                          vm.saving = false;
                          angular.element('#modal-save-draft-progress-bar').modal('hide');
                          $scope.form.mobileTrapForm.$setPristine();
                          $scope.form.oysterMeasurementForm.$setPristine();
                          $scope.form.settlementTilesForm.$setPristine();
                          $scope.form.siteConditionForm.$setPristine();
                          $scope.form.waterQualityForm.$setPristine();
                          if (callback) callback();
                        });
                      }, 1000);
                    });
                  }, 1000);
                });
              }, 1000);
            });
          }, 1000);
        });
      }, 1000);
    };

    // Submit the protocols as a team member
    vm.submitTeamMember = function() {
      vm.saveDraft(function() {
        vm.submitting = true;

        vm.validateProtocols(function() {
          if (vm.protocolsSuccessful()) {
            var protocols = {};
            if(vm.viewSiteCondition && $scope.siteCondition) protocols.siteCondition = $scope.siteCondition;
            if(vm.viewOysterMeasurement && $scope.oysterMeasurement) protocols.oysterMeasurement = $scope.oysterMeasurement;
            if(vm.viewMobileTrap && $scope.mobileTrap) protocols.mobileTrap = $scope.mobileTrap;
            if(vm.viewSettlementTiles && $scope.settlementTiles) protocols.settlementTiles = $scope.settlementTiles;
            if(vm.viewWaterQuality && $scope.waterQuality) protocols.waterQuality = $scope.waterQuality;

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
            if(vm.viewSiteCondition) {
              $scope.siteCondition = vm.expedition.protocols.siteCondition;
              $scope.siteCondition.status = 'published';
            }
            if(vm.viewOysterMeasurement) {
              $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
              $scope.oysterMeasurement.status = 'published';
            }
            if(vm.viewMobileTrap) {
              $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
              $scope.mobileTrap.status = 'published';
            }
            if(vm.viewSettlementTiles) {
              $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
              $scope.settlementTiles.status = 'published';
            }
            if(vm.viewWaterQuality) {
              $scope.waterQuality = vm.expedition.protocols.waterQuality;
              $scope.waterQuality.status = 'published';
            }

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
    $scope.return = function(returnedNotes) {
      vm.returning = true;

      var protocols = {};
      if(vm.viewSiteCondition && $scope.siteCondition) protocols.siteCondition = $scope.siteCondition;
      if(vm.viewOysterMeasurement && $scope.oysterMeasurement) protocols.oysterMeasurement = $scope.oysterMeasurement;
      if(vm.viewMobileTrap && $scope.mobileTrap) protocols.mobileTrap = $scope.mobileTrap;
      if(vm.viewSettlementTiles && $scope.settlementTiles) protocols.settlementTiles = $scope.settlementTiles;
      if(vm.viewWaterQuality && $scope.waterQuality) protocols.waterQuality = $scope.waterQuality;

      $http.post('/api/expeditions/' + vm.expedition._id + '/return?full=true', {
        protocols: protocols,
        returnedNotes: returnedNotes
      }).
      success(function(data, status, headers, config) {
        vm.expedition = data;

        if(vm.viewSiteCondition) {
          $scope.siteCondition = vm.expedition.protocols.siteCondition;
          $scope.siteCondition.status = 'returned';
        }
        if(vm.viewOysterMeasurement) {
          $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
          $scope.oysterMeasurement.status = 'returned';
        }
        if(vm.viewMobileTrap) {
          $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
          $scope.mobileTrap.status = 'returned';
        }
        if(vm.viewSettlementTiles) {
          $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
          $scope.settlementTiles.status = 'returned';
        }
        if(vm.viewWaterQuality) {
          $scope.waterQuality = vm.expedition.protocols.waterQuality;
          $scope.waterQuality.status = 'returned';
        }
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

    vm.openReturnModal = function() {
      angular.element('#modal-return-expedition').modal('show');
    };

    vm.submitReturnModal = function(returnedNotes) {
      angular.element('#modal-return-expedition').modal('hide');
      $scope.return(returnedNotes);
    };

    vm.cancelReturnModal = function() {
      angular.element('#modal-return-expedition').modal('hide');
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
        vm.expedition = data;
        if(vm.viewSiteCondition) {
          $scope.siteCondition = vm.expedition.protocols.siteCondition;
          $scope.siteCondition.status = 'unpublished';
        }
        if(vm.viewOysterMeasurement) {
          $scope.oysterMeasurement = vm.expedition.protocols.oysterMeasurement;
          $scope.oysterMeasurement.status = 'unpublished';
        }
        if(vm.viewMobileTrap) {
          $scope.mobileTrap = vm.expedition.protocols.mobileTrap;
          $scope.mobileTrap.status = 'unpublished';
        }
        if(vm.viewSettlementTiles) {
          $scope.settlementTiles = vm.expedition.protocols.settlementTiles;
          $scope.settlementTiles.status = 'unpublished';
        }
        if(vm.viewWaterQuality) {
          $scope.waterQuality = vm.expedition.protocols.waterQuality;
          $scope.waterQuality.status = 'unpublished';
        }

        vm.unpublishing = false;
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
    var teamId = (vm.expedition.team && vm.expedition.team._id) ? vm.expedition.team._id : vm.expedition.team;

    // Team member select set up
    $scope.teamMemberSelectConfig = {
      mode: 'tags-id',
      id: '_id',
      text: 'displayName',
      textLookup: function(obj) {
        var id = (obj && obj._id) ? obj._id : obj;
        return TeamMembersService.get({ memberId: id }).$promise;
      },
      options: function(searchText) {
        return TeamMembersService.query({
          searchString: searchText,
          teamId: teamId
        });
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

    ////
    //Set up page change listeners to warn the user when they are leaving protocols editing
    ////

    var leavingMessage = 'Are you sure you want to leave protocol editing? Any unsaved data will be lost.';
    var areProtocolFormsDirty = function() {
      return ($scope.form.mobileTrapForm && $scope.form.mobileTrapForm.$dirty) ||
        ($scope.form.oysterMeasurementForm && $scope.form.oysterMeasurementForm.$dirty) ||
        ($scope.form.settlementTilesForm && $scope.form.settlementTilesForm.$dirty) ||
        ($scope.form.siteConditionForm && $scope.form.siteConditionForm.$dirty) ||
        ($scope.form.waterQualityForm && $scope.form.waterQualityForm.$dirty);
    };

    var cleanupPageChangeListeners = function() {
      if(stopListeningForStateChangeStart) {
        stopListeningForStateChangeStart();
      }
      if(window.onbeforeunload) {
        window.onbeforeunload = null;
      }
    };

    //clean up our listeners when the controller exits
    //doing this here in the event they selected "leave page"
    //from the window.onbeforeunload event default dialog since
    //i don't think i can get the dialog's return value (right?)
    $scope.$on('$destroy', function() {
      if(!$state.is('expeditions.protocols')) {
        cleanupPageChangeListeners();
      }
    });

    var handleStateChangeStartEvent = function(event, toState, toParams, fromState, fromParams) {
      if(!areProtocolFormsDirty()) {
        cleanupPageChangeListeners();
        return;
      }

      event.preventDefault();
      var wantsToLeave = confirm(leavingMessage);
      if(wantsToLeave) {
        cleanupPageChangeListeners();
        $state.go(toState, toParams);
      }
    };

    var handleWindowUnload = function(event) {
      if(!areProtocolFormsDirty()) {
        cleanupPageChangeListeners();
        return undefined;
      }
      var e = event || window.event;
      if (e) {
        e.returnValue = leavingMessage;
      }
      return leavingMessage;
    };

    //catch state changes like the user clicks to another area of the application
    var listenForStateChanges = function() {
      if($state.is('expeditions.protocols')) {
        stopListeningForStateChangeStart = $scope.$on('$stateChangeStart', handleStateChangeStartEvent);
      }
    };

    //catch the refresh button or the user entering a different URL in the browser
    var listenForWindowUnload = function() {
      if($state.is('expeditions.protocols')) {
        window.onbeforeunload = handleWindowUnload;
      }
    };

    //set up listeners for leaving the protocols page
    $scope.$applyAsync(listenForStateChanges);
    $scope.$applyAsync(listenForWindowUnload);

    vm.openViewUserModal = function(user) {
      vm.userToView = user || {};
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };
  }
})();
