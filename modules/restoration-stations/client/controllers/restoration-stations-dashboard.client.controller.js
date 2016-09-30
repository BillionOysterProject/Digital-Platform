(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsDashboardController', RestorationStationsDashboardController);

  RestorationStationsDashboardController.$inject = ['$scope', '$rootScope', '$state', 'lodash', 'moment', 'Authentication',
  'TeamsService', 'TeamMembersService', 'RestorationStationsService', 'ExpeditionsService',
  'ExpeditionActivitiesService', 'TeamRequestsService', 'SchoolOrganizationsService',
  'BodiesOfWaterService', 'BoroughsCountiesService','ExpeditionViewHelper'];

  function RestorationStationsDashboardController($scope, $rootScope, $state, lodash, moment, Authentication,
    TeamsService, TeamMembersService, RestorationStationsService, ExpeditionsService,
    ExpeditionActivitiesService, TeamRequestsService, SchoolOrganizationsService,
    BodiesOfWaterService, BoroughsCountiesService, ExpeditionViewHelper) {
    var vm = this;
    vm.user = Authentication.user;

    vm.filter = {
      teamId: '',
      teamLeadId: ''
    };

    vm.canGeocode = false;
    vm.canMoveMarker = false;
    vm.showMarker = false;
    vm.canClickMapToAddMarker = false;

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
    vm.isTeamMemberPending = checkRole('team member pending') || checkRole('partner');
    vm.isAdmin = checkRole('admin');

    SchoolOrganizationsService.query({
      sort: 'name'
    }, function(data) {
      vm.organizations = data;
    });

    BodiesOfWaterService.query({
    }, function(data) {
      vm.bodiesOfWater = data;
    });

    BoroughsCountiesService.query({
    }, function(data) {
      vm.boroughsCounties = data;
    });



    var getORSes = function(teamLeadId) {
      if (vm.isTeamLead || vm.isTeamLeadPending) {
        RestorationStationsService.query({
          teamLead: true
        }, function(data) {
          vm.stations = data;
        });
      } else if (vm.isAdmin) {
        RestorationStationsService.query({
        }, function(data) {
          vm.stations = data;
        });
      } else {
        if (teamLeadId) {
          RestorationStationsService.query({
            teamLeadId: teamLeadId
          }, function(data) {
            vm.stations = data;
          });
        }
      }
    };
    getORSes();

    vm.getOrganizationName = function(id) {
      var index = lodash.findIndex(vm.organizations, function(o) {
        return o._id === id;
      });
      return (index > -1) ? vm.organizations[index].name : '';
    };

    vm.findTeams = function() {
      var byOwner, byMember;
      if (vm.isTeamLead || vm.isTeamLeadPending) {
        byOwner = true;
      } else {
        byMember = true;
      }
      TeamsService.query({
        byOwner: byOwner,
        byMember: byMember
      }, function(data) {
        vm.teams = data;

        if ($rootScope.teamId) {
          vm.filter.teamId = ($rootScope.teamId) ? $rootScope.teamId : '';

          var teamIndex = lodash.findIndex(vm.teams, function(t) {
            return t._id === vm.filter.teamId;
          });
          if (teamIndex > -1) vm.team = vm.teams[teamIndex];
          vm.fieldChanged(vm.team);
        } else if (!vm.filter.teamId || vm.filter.teamId === '') {
          if (vm.teams.length > 0) {
            vm.team = vm.teams[0];
            vm.filter.teamId = (vm.team) ? vm.team._id : '';
            vm.findTeamValues();
          }
        }
        if (vm.team) vm.filter.teamLeadId = (vm.team.teamLead._id) ? vm.team.teamLead._id : vm.team.teamLead;
      });
    };

    vm.findTeamRequests = function() {
      TeamRequestsService.query({
        byMember: true
      }, function(data) {
        if (data.length > 0) {
          vm.findSchoolOrgRestorationStations((data[0] && data[0].teamLead && data[0].teamLead.schoolOrg &&
            data[0].teamLead.schoolOrg._id) ? data[0].teamLead.schoolOrg._id : data[0].teamLead.schoolOrg);
        }
      });
    };

    vm.findSchoolOrgRestorationStations = function(schoolOrgId) {
      RestorationStationsService.query({
        //schoolOrgId: schoolOrgId
      }, function(data) {
        console.log('ORSes', data);
        vm.mapPoints = [];
        for (var i = 0; i < data.length; i++) {
          var station = data[i];
          var photoUrl = (station.photo && station.photo.path) ? station.photo.path : '';

          var stationMap = {
            lat: station.latitude,
            lng: station.longitude,
            icon: {
              icon: 'glyphicon-map-marker',
              prefix: 'glyphicon',
              markerColor: (station.status === 'Active') ? 'green' : 'red'
            },
            info:{
              name: station.name,
              bodyOfWater: station.bodyOfWater,
              teamLead: station.teamLead.displayName,
              schoolOrg: station.schoolOrg.name,
              photoUrl: photoUrl,
              html: '<form-restoration-station-marker-popup name="name" body-of-water="bodyOfWater" team-lead="teamLead" school-org="schoolOrg" photo-url="photoUrl"> </form-restoration-station-marker-popup>'
            }
          };

          vm.mapPoints.push(stationMap);
        }
      });
    };

    vm.findTeamValues = function() {
      TeamMembersService.query({
        byOwner: (vm.isTeamLead || vm.isTeamLeadPending) ? true : '',
        teamId: vm.filter.teamId
      }, function(data) {
        vm.members = data;
      });

      vm.findSchoolOrgRestorationStations((vm.team && vm.team.schoolOrg && vm.team.schoolOrg._id) ?
        vm.team.schoolOrg._id : vm.team.schoolOrg);

      var byMember = ((vm.isTeamMember || vm.isTeamMemberPending) && !vm.isTeamLead) ? true : '';

      if (byMember) {
        getORSes(vm.filter.teamId);
      }

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

      ExpeditionActivitiesService.query({
        teamId: vm.filter.teamId,
      }, function(data) {
        vm.activitiesCount = data.length;
      });
    };

    ExpeditionsService.query({
      published: true,
      sort: 'startDate',
      limit: 5
    }, function(data) {
      vm.published = data;
    });

    if (vm.isTeamLead || vm.isTeamMember || vm.isAdmin) {
      vm.findTeams();
    } else if (vm.isTeamMemberPending) {
      vm.findTeamRequests();
    } else {
      vm.findSchoolOrgRestorationStations((vm.user && vm.user.schoolOrg && vm.user.schoolOrg._id) ?
        vm.user.schoolOrg._id : vm.user.schoolOrg);
    }

    vm.fieldChanged = function(team) {
      vm.filter.teamId = (team) ? team._id : '';
      vm.team = team;
      if (vm.team) vm.filter.teamLeadId = (vm.team.teamLead._id) ? vm.team.teamLead._id : vm.team.teamLead;
      vm.findTeamValues();
    };

    vm.expeditionLink = function(expedition) {
      return ((vm.isTeamLead || vm.isAdmin) && (expedition.status === 'incomplete' || expedition.status === 'returned' ||
        expedition.status === 'unpublished')) ?
      'expeditions.view({ expeditionId: expedition._id })' :
      'expeditions.protocols({ expeditionId: expedition._id })';
    };

    vm.isUpcoming = function(expedition) {
      return (moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isAfter(moment())) ? true : false;
    };

    vm.getExpeditionDate = ExpeditionViewHelper.getExpeditionDate;
    vm.getExpeditionTimeRange = ExpeditionViewHelper.getExpeditionTimeRange;

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
      if (activity.protocols.siteCondition) changed.push('1');
      if (activity.protocols.oysterMeasurement) changed.push('2');
      if (activity.protocols.mobileTrap) changed.push('3');
      if (activity.protocols.settlementTiles) changed.push('4');
      if (activity.protocols.waterQuality) changed.push('5');
      var formatted = (changed === 1) ? 'Protocol ': 'Protocols ';
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
      if (station.isCurrentUserOwner) {
        vm.openFormRestorationStation(station);
      }
    };

    vm.openFormRestorationStation = function(station) {
      vm.station = (station) ? new RestorationStationsService(station) : new RestorationStationsService();
      if (vm.station.latitude && vm.station.longitude) {
        vm.stationMapPoints = [{
          lat: vm.station.latitude,
          lng: vm.station.longitude,
          icon: {
            icon: 'glyphicon-map-marker',
            prefix: 'glyphicon',
            markerColor: 'blue'
          },
        }];
      }

      angular.element('#modal-station-register').modal('show');
    };

    vm.saveFormRestorationStation = function() {
      getORSes(vm.filter.teamId);
      vm.station = {};

      angular.element('#modal-station-register').modal('hide');
    };

    vm.removeFormRestorationStation = function() {
      getORSes(vm.filter.teamId);
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

    vm.createExpedition = function() {
      $rootScope.teamId = vm.filter.teamId;
      $state.go('expeditions.create');
    };
  }
})();
