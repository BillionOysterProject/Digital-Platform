(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsDashboardController', RestorationStationsDashboardController);

  RestorationStationsDashboardController.$inject = ['$scope', 'lodash', 'moment', 'Authentication',
  'TeamsService', 'TeamMembersService', 'RestorationStationsService', 'ExpeditionsService',
  'ExpeditionActivitiesService', 'TeamRequestsService'];

  function RestorationStationsDashboardController($scope, lodash, moment, Authentication,
    TeamsService, TeamMembersService, RestorationStationsService, ExpeditionsService,
    ExpeditionActivitiesService, TeamRequestsService) {
    var vm = this;
    vm.user = Authentication.user;

    vm.filter = {
      teamId: ''
    };

    vm.canGeocode = true;
    vm.canMoveMarker = true;
    vm.showMarker = true;

    vm.mapControls = {};

    var checkRole = function(role) {
      var teamLeadIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');
    vm.isTeamLeadPending = checkRole('team lead pending');
    vm.isTeamMemberPending = checkRole('team member pending');

    vm.findTeams = function() {
      var byOwner, byMember;
      if (vm.isTeamLead) {
        byOwner = true;
      } else {
        byMember = true;
      }
      TeamsService.query({
        byOwner: byOwner,
        byMember: byMember
      }, function(data) {
        vm.teams = data;

        if (!vm.filter.teamId || vm.filter.teamId === '') {
          if (vm.teams.length > 0) {
            vm.team = vm.teams[0];
            vm.filter.teamId = (vm.team) ? vm.team._id : '';
            vm.findTeamValues();
          }
        }
      });
    };

    vm.findTeamRequests = function() {
      TeamRequestsService.query({
        byMember: true
      }, function(data) {
        if (data.length > 0) {
          vm.findSchoolOrgRestorationStations(data[0].teamLead.schoolOrg);
        }
      });
    };

    vm.findSchoolOrgRestorationStations = function(schoolOrgId) {
      RestorationStationsService.query({
        schoolOrgId: schoolOrgId
      }, function(data) {
        vm.mapPoints = [];
        for (var i = 0; i < data.length; i++) {
          var station = data[i];
          vm.mapPoints.push({
            lat: station.latitude,
            lng: station.longitude,
            icon: {
              icon: 'glyphicon-map-marker',
              prefix: 'glyphicon',
              markerColor: (station.status === 'Active') ? 'green' : 'red'
            }
          });
        }
        console.log('mapPoints', vm.mapPoints);
      });
    };

    vm.findTeamValues = function() {
      TeamMembersService.query({
        byOwner: true,
        teamId: vm.filter.teamId
      }, function(data) {
        vm.members = data;
      });

      RestorationStationsService.query({
        teamId: vm.filter.teamId
      }, function(data) {
        vm.stations = data;
      });

      vm.findSchoolOrgRestorationStations(vm.team.schoolOrg._id);

      var byMember = (vm.isTeamLead) ? '' : true;
      ExpeditionsService.query({
        teamId: vm.filter.teamId,
        byMember: byMember,
        limit: 5
      }, function(data) {
        vm.expeditions = data;
      });

      ExpeditionActivitiesService.query({
        teamId: vm.filter.teamId,
        limit: 5
      }, function(data) {
        vm.activities = data;
      });
    };

    if (vm.isTeamLead || vm.isTeamMember) {
      vm.findTeams();
    } else if (vm.isTeamMemberPending) {
      vm.findTeamRequests();
    } else {
      vm.findSchoolOrgRestorationStations(vm.user.schoolOrg);
    }

    vm.fieldChanged = function(team) {
      vm.filter.teamId = (team) ? team._id : '';
      vm.team = team;
      vm.findTeamValues();
    };

    vm.expeditionLink = function(expedition) {
      return (vm.isTeamLead && (expedition.status === 'incomplete' || expedition.status === 'returned' ||
        expedition.status === 'unpublished')) ?
      'expeditions.edit({ expeditionId: expedition._id })' :
      'expeditions.protocols({ expeditionId: expedition._id })';
    };

    vm.isUpcoming = function(expedition) {
      return (moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isAfter(moment())) ? true : false;
    };

    vm.getExpeditionDate = function(expedition) {
      return moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
    };

    vm.getExpeditionTimeRange = function(expedition) {
      return moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm')+'-'+
        moment(expedition.monitoringEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm');
    };

    vm.checkWrite = function(teamList) {
      if (checkRole('team lead')) {
        return true;
      } else {
        var teamListIndex = lodash.findIndex(teamList, function(m) {
          return m.username === vm.user.username;
        });
        return (teamListIndex > -1) ? true : false;
      }
    };

    vm.checkStatusIncomplete = function(expedition) {
      var protocolsComplete = true;
      if (vm.checkWrite(expedition.teamLists.siteCondition) && expedition.protocols.siteCondition.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.oysterMeasurement) && expedition.protocols.oysterMeasurement.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.mobileTrap) && expedition.protocols.mobileTrap.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.settlementTiles) && expedition.protocols.settlementTiles.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.waterQuality) && expedition.protocols.waterQuality.status === 'incomplete') protocolsComplete = false;
      return expedition.status === 'incomplete' && !protocolsComplete;
    };

    vm.checkStatusPending = function(expedition) {
      var protocolsComplete = true;
      if (vm.checkWrite(expedition.teamLists.siteCondition) && expedition.protocols.siteCondition.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.oysterMeasurement) && expedition.protocols.oysterMeasurement.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.mobileTrap) && expedition.protocols.mobileTrap.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.settlementTiles) && expedition.protocols.settlementTiles.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.waterQuality) && expedition.protocols.waterQuality.status === 'incomplete') protocolsComplete = false;
      return expedition.status === 'pending' || (protocolsComplete && expedition.status !== 'published');
    };

    vm.checkStatusReturned = function(expedition) {
      var protocolsComplete = true;
      if (vm.checkWrite(expedition.teamLists.siteCondition) && expedition.protocols.siteCondition.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.oysterMeasurement) && expedition.protocols.oysterMeasurement.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.mobileTrap) && expedition.protocols.mobileTrap.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.settlementTiles) && expedition.protocols.settlementTiles.status === 'incomplete') protocolsComplete = false;
      if (vm.checkWrite(expedition.teamLists.waterQuality) && expedition.protocols.waterQuality.status === 'incomplete') protocolsComplete = false;
      return expedition.status === 'returned' && !protocolsComplete;
    };

    vm.displaySubmittedProtocols = function(activity) {
      var changed = [];
      if (activity.protocols.siteCondition) changed.push('Protocol 1');
      if (activity.protocols.oysterMeasurement) changed.push('Protocol 2');
      if (activity.protocols.mobileTrap) changed.push('Protocol 3');
      if (activity.protocols.settlementTiles) changed.push('Protocol 4');
      if (activity.protocols.waterQuality) changed.push('Protocol 5');
      var formatted = '';
      for (var i = 0; i < changed.length; i++) {
        formatted += changed[i];
        if (i === changed.length - 2 && changed.length > 1) {
          formatted += ' & ';
        } else if (i < changed.length - 1 && changed.length > 1) {
          formatted += ', ';
        }
      }
      return formatted;
    };

    vm.canEditRestorationStation = function(station) {
      if (station.team.toString() === vm.filter.teamId.toString() ||
        station.team._id.toString() === vm.filter.teamId.toString()) {
        vm.openFormRestorationStation(station);
      }
    };

    vm.openFormRestorationStation = function(station) {
      vm.station = (station) ? new RestorationStationsService(station) : new RestorationStationsService();
      if (!vm.station.team) vm.station.team = vm.filter.teamId;

      angular.element('#modal-station-register').modal('show');
    };

    vm.saveFormRestorationStation = function() {
      RestorationStationsService.query({
        teamId: vm.filter.teamId
      }, function(data) {
        vm.stations = data;
      });
      vm.station = {};

      angular.element('#modal-station-register').modal('hide');
    };

    vm.removeFormRestorationStation = function() {
      RestorationStationsService.query({
        teamId: vm.filter.teamId
      }, function(data) {
        vm.stations = data;
      });
      vm.station = {};

      angular.element('#modal-station-register').modal('hide');
    };

    vm.cancelFormRestorationStation = function() {
      vm.station = {};

      angular.element('#modal-station-register').modal('hide');
    };

    vm.placeSelected = function (place) {
      if (place.location) {
        vm.mapControls.zoomToLocation(place.location);
        updateCoords(place.location);
      }

    };

    vm.mapClick = function(e){
      updateCoords(e.latlng);
    };

    vm.markerDragEnd = function(location){
      updateCoords(location);
    };

    function updateCoords(coords) {
      $scope.station.latitude = coords.lat;
      $scope.station.longitude = coords.lng;
    }
  }
})();
