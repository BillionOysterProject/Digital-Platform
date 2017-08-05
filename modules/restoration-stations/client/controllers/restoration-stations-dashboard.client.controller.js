(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsDashboardController', RestorationStationsDashboardController);

  RestorationStationsDashboardController.$inject = ['$scope', '$rootScope', '$state', '$location', '$http', 'lodash',
    'moment', 'Authentication', 'TeamsService', 'TeamMembersService', 'RestorationStationsService', 'ExpeditionsService',
    'ExpeditionActivitiesService', 'TeamRequestsService', 'SchoolOrganizationsService', 'ExpeditionViewHelper'];

  function RestorationStationsDashboardController($scope, $rootScope, $state, $location, $http, lodash,
    moment, Authentication, TeamsService, TeamMembersService, RestorationStationsService, ExpeditionsService,
    ExpeditionActivitiesService, TeamRequestsService, SchoolOrganizationsService, ExpeditionViewHelper) {
    var vm = this;
    vm.user = Authentication.user;
    vm.userToView = {};

    vm.filter = {
      teamId: '',
      teamLeadId: ''
    };

    vm.canGeocode = false;
    vm.canMoveMarker = false;
    vm.showMarker = false;
    vm.canClickMapToAddMarker = false;

    vm.mapControls = {};

    var checkRole = ExpeditionViewHelper.checkRole;
    vm.getExpeditionDate = ExpeditionViewHelper.getExpeditionDate;
    vm.getExpeditionTimeRange = ExpeditionViewHelper.getExpeditionTimeRange;
    vm.checkWrite = ExpeditionViewHelper.checkWrite;
    vm.checkStatusPending = ExpeditionViewHelper.checkStatusPending;
    vm.checkStatusIncomplete = ExpeditionViewHelper.checkStatusIncomplete;
    vm.checkStatusReturned = ExpeditionViewHelper.checkStatusReturned;
    vm.checkStatusUnpublished = ExpeditionViewHelper.checkStatusUnpublished;
    vm.isUpcoming = ExpeditionViewHelper.isUpcoming;
    vm.displayAssignedProtocols = ExpeditionViewHelper.displayAssignedProtocols;
    vm.expeditionLink = ExpeditionViewHelper.expeditionLink;

    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');
    vm.isTeamLeadPending = checkRole('team lead pending');
    vm.isTeamMemberPending = checkRole('team member pending') || checkRole('partner');
    vm.isAdmin = checkRole('admin');

    var findSchoolOrgRestorationStations = function() {
      RestorationStationsService.query({
      }, function(data) {
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
              station: station,
              openView: vm.openView,
              html: '<form-restoration-station-marker-popup station="station" open-view="openView"> </form-restoration-station-marker-popup>'
            }
          };

          vm.mapPoints.push(stationMap);
        }
      });
    };

    var getORSes = function(teamLeadId) {
      if (!teamLeadId) teamLeadId = (vm.user && vm.user._id) ? vm.user._id : vm.user;
      RestorationStationsService.query({
        teamLeadId: teamLeadId
      }, function(data) {
        vm.stations = data;
      });
      findSchoolOrgRestorationStations();
    };

    if (vm.user && vm.user.username && !vm.user.schoolOrg) {
      $http.get('/api/users/username', {
        params: { username: vm.user.username }
      })
      .success(function(data, status, headers, config) {
        vm.user = data;
        getORSes();
      })
      .error(function(data, status, headers, config) {
        console.log('err', data);
      });
    } else {
      getORSes();
    }

    SchoolOrganizationsService.query({
      sort: 'name'
    }, function(data) {
      vm.organizations = data;
    });

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
          $rootScope.teamId = null;

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
          findSchoolOrgRestorationStations();
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

      var byMember = ((vm.isTeamMember || vm.isTeamMemberPending) && !vm.isTeamLead) ? true : '';

      if (byMember) {
        getORSes();
      }

      ExpeditionsService.query({
        teamId: vm.filter.teamId,
        byMember: byMember,
        limit: 5
      }, function(data) {
        vm.expeditions = data.expeditions;
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
      vm.published = data.expeditions;
    });

    if (vm.isTeamLead || vm.isTeamLeadPending || vm.isTeamMember || vm.isAdmin) {
      vm.findTeams();
    } else if (vm.isTeamMemberPending) {
      vm.findTeamRequests();
    }

    vm.fieldChanged = function(team) {
      vm.filter.teamId = (team) ? team._id : '';
      vm.team = team;
      if (vm.team) vm.filter.teamLeadId = (vm.team.teamLead._id) ? vm.team.teamLead._id : vm.team.teamLead;
      vm.findTeamValues();
    };

    vm.canEditRestorationStation = function(station) {
      if (station.isCurrentUserOwner) {
        vm.openFormRestorationStation(station);
      }
    };

    var openRestorationStationPopup = function(station, initial) {
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

      vm.initial = initial || 'orsView';
      angular.element('#modal-station').modal('show');
    };

    vm.openFormRestorationStation = function(station) {
      openRestorationStationPopup(station, 'orsForm');
    };

    vm.openViewRestorationStation = function(station) {
      openRestorationStationPopup(station, 'orsView');
    };

    // vm.saveFormRestorationStation = function() {
    //   getORSes();
    //   vm.station = {};
    //
    //   angular.element('#modal-station').modal('hide');
    // };
    //
    // vm.removeFormRestorationStation = function() {
    //   getORSes();
    //   vm.station = {};
    //
    //   angular.element('#modal-station').modal('hide');
    // };

    vm.closeFormRestorationStation = function(refresh) {
      if (refresh) getORSes();
      vm.station = {};

      angular.element('#modal-station').modal('hide');
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
      if (!vm.isTeamLeadPending) {
        $rootScope.teamId = vm.filter.teamId;
        $state.go('expeditions.create');
      }
    };

    vm.openView = function(station) {
      vm.openViewRestorationStation(station);
    };

    vm.openViewUserModal = function(user, initial) {
      vm.userToView = user;
      vm.initialUser = initial || 'userView';
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };

    if ($location.search().openORSForm) {
      vm.initial = 'orsForm';
      RestorationStationsService.get({
        stationId: $location.search().openORSForm
      }, function(data) {
        vm.openViewRestorationStation(data.toJSON());
      });

    } else {
      vm.initial = 'orsView';
    }
  }
})();
