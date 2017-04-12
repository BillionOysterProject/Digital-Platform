(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationListController', RestorationStationListController);

  RestorationStationListController.$inject = ['$scope', 'ExpeditionViewHelper', 'RestorationStationsService',
    'SchoolOrganizationsService', 'TeamLeads'];

  function RestorationStationListController($scope, ExpeditionViewHelper, RestorationStationsService,
    SchoolOrganizationsService, TeamLeads) {
    var vm = this;
    vm.filtered = false;

    vm.filter = {
      organization: '',
      organizationObj: {
        name: 'All'
      },
      organizationName: 'All',
      teamLead: '',
      teamLeadObj: {
        displayName: 'All'
      },
      teamLeadName: 'All',
      status: '',
      statusString: 'All',
      searchString: ''
    };

    vm.canGeocode = false;
    vm.canMoveMarker = false;
    vm.showMarker = false;
    vm.canClickMapToAddMarker = false;

    vm.mapControls = {};

    var checkRole = ExpeditionViewHelper.checkRole;
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

    var findORSes = function() {
      RestorationStationsService.query({
        status: vm.filter.status,
        organization: vm.filter.organization,
        teamLead: vm.filter.teamLead,
        searchString: vm.filter.searchString
      }, function(data) {
        vm.stations = data;
      });
      findSchoolOrgRestorationStations();
    };
    findORSes();

    vm.resetFilters = function() {
      vm.filtered = false;
      vm.filter = {
        organization: '',
        organizationObj: {
          name: 'All'
        },
        organizationName: 'All',
        teamLead: '',
        teamLeadObj: {
          displayName: 'All'
        },
        teamLeadName: 'All',
        status: '',
        statusString: 'All',
        searchString: ''
      };
      findORSes();
    };

    var findTeamLeads = function() {
      TeamLeads.query({
        roles: 'team lead',
        sort: 'name',
        organizationId: vm.filter.organization,
      }, function(data) {
        vm.teamLeads = [{
          displayName: 'All'
        }];
        vm.teamLeads = vm.teamLeads.concat(data);
        if (!vm.filter.teamLeadObj) vm.filter.teamLeadObj = vm.teamLeads[0];
      });
    };
    findTeamLeads();

    vm.teamLeadSelected = function() {
      vm.filtered = true;
      vm.filter.teamLead = (vm.filter.teamLeadObj && vm.filter.teamLeadObj._id) ? vm.filter.teamLeadObj._id : '';
      vm.filter.teamLeadName = (vm.filter.teamLeadObj && vm.filter.teamLeadObj.displayName) ? vm.filter.teamLeadObj.displayName : '';

      findORSes();
    };

    SchoolOrganizationsService.query({
      sort: 'name'
    }, function(data) {
      vm.organizations = [{
        name: 'All'
      }];
      vm.organizations = vm.organizations.concat(data);
      vm.filter.organizationObj = vm.organizations[0];
    });

    vm.organizationSelected = function() {
      vm.filtered = true;
      vm.filter.organization = (vm.filter.organizationObj && vm.filter.organizationObj._id) ? vm.filter.organizationObj._id : '';
      vm.filter.organizationName = (vm.filter.organizationObj && vm.filter.organizationObj.name) ? vm.filter.organizationObj.name : '';
      findORSes();
      findTeamLeads();
    };

    vm.statuses = ['All', 'Active', 'Damaged', 'Destroyed', 'Lost', 'Unknown'];

    vm.statusSelected = function() {
      vm.filtered = true;
      vm.filter.status = (vm.filter.statusString && vm.filter.statusString === 'All') ? '' : vm.filter.statusString;

      findORSes();
    };

    vm.searchChange = function() {
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.filtered = true;
        findORSes();
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

    vm.openView = function(station) {
      vm.openViewRestorationStation(station);
    };

    vm.openFormRestorationStation = function(station) {
      openRestorationStationPopup(station, 'orsForm');
    };

    vm.openViewRestorationStation = function(station) {
      openRestorationStationPopup(station, 'orsView');
    };

    vm.closeFormRestorationStation = function(refresh) {
      if (refresh) findORSes();
      vm.station = {};

      angular.element('#modal-station').modal('hide');
    };
  }
})();
