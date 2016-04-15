(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionProtocolsController', ExpeditionProtocolsController);

  ExpeditionProtocolsController.$inject = ['$scope', '$state', 'moment', 'lodash', 'expeditionResolve', 'Authentication'];

  function ExpeditionProtocolsController($scope, $state, moment, lodash, expedition, Authentication) {
    var vm = this;
    vm.expedition = expedition;
    vm.user = Authentication.user;

    console.log('vm.expedition', vm.expedition);

    vm.getExpeditionDate = function() {
      return moment(vm.expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
    };

    var checkRole = function(role) {
      var teamLeadIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');

    vm.checkWrite = function(teamList) {
      if (checkRole('team lead')) {
        return true;
      } else {
        var teamListIndex = lodash.findIndex(teamList, function(m) {
          console.log('m', m);
          return m === vm.user._id;
        });
        return (teamListIndex > -1) ? true : false;
      }
    };

    vm.setupInputValues = function(protocol, teamList) {
      if (vm.expedition.station) {
        if (!protocol.latitude && vm.expedition.station.latitude) {
          protocol.latitude = vm.expedition.station.latitude;
        }
        if (!protocol.longitude && vm.expedition.station.longitude) {
          protocol.longitude = vm.expedition.station.longitude;
        }
      }
      if (vm.expedition.monitoringStartDate) {
        if (!protocol.collectionTime) {
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
      return protocol;
    };

    vm.siteCondition = vm.setupInputValues(vm.expedition.protocols.siteCondition, vm.expedition.teamLists.siteCondition);
    vm.oysterMeasurement = vm.setupInputValues(vm.expedition.protocols.oysterMeasurement, vm.expedition.teamLists.oysterMeasurement);
    vm.mobileTrap = vm.setupInputValues(vm.expedition.protocols.mobileTrap, vm.expedition.teamLists.mobileTrap);
    vm.settlementTiles = vm.setupInputValues(vm.expedition.protocols.settlementTiles, vm.expedition.teamLists.settlementTiles);
    vm.waterQuality = vm.setupInputValues(vm.expedition.protocols.waterQuality, vm.expedition.teamLists.waterQuality);

    vm.viewSiteCondition = vm.checkWrite(vm.expedition.teamLists.siteCondition);
    vm.viewOysterMeasurement = vm.checkWrite(vm.expedition.teamLists.oysterMeasurement);
    vm.viewMobileTrap = vm.checkWrite(vm.expedition.teamLists.mobileTrap);
    vm.viewSettlementTiles = vm.checkWrite(vm.expedition.teamLists.settlementTiles);
    vm.viewWaterQuality = vm.checkWrite(vm.expedition.teamLists.waterQuality);
  }
})();
