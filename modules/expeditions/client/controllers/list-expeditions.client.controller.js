(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsListController', ExpeditionsListController);

  ExpeditionsListController.$inject = ['moment', 'lodash', 'Authentication', 'ExpeditionsService', 'TeamsService', 'ExpeditionViewHelper',
  'SchoolOrganizationsService', 'RestorationStationsService', 'TeamLeads', '$timeout', '$rootScope', '$scope', '$stateParams'];

  function ExpeditionsListController(moment, lodash, Authentication, ExpeditionsService, TeamsService, ExpeditionViewHelper,
    SchoolOrganizationsService, RestorationStationsService, TeamLeads, $timeout, $rootScope, $scope, $stateParams) {
    var vm = this;
    vm.user = Authentication.user;
    vm.activeTab = ($stateParams.active) ? $stateParams.active : 'pubexpeditions';

    vm.opened = {
      startDate: false,
      endDate: false
    };
    vm.maxDate = new Date();
    vm.format = 'MM/dd/yyyy';
    vm.shortFormat = 'MM/yyyy';
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false
    };

    vm.openStartDate = function($event) {
      vm.opened.startDate = true;
    };

    vm.openEndDate = function($event) {
      vm.opened.endDate = true;
    };

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

    var byOwner, byMember;
    if (vm.isTeamLead || vm.isTeamLeadPending) {
      byOwner = true;
    } else {
      byMember = true;
    }

    vm.filter = {
      station: '',
      stationObj: {
        name: 'All'
      },
      stationName: 'All',
      organization: '',
      organizationObj: {
        name: 'All'
      },
      organizationName: 'All',
      team: '',
      teamObj: {
        name: 'All'
      },
      teamName: 'All',
      teamLead: '',
      teamLeadObj: {
        displayName: 'All'
      },
      teamLeadName: 'All',
      startDate: '',
      endDate: '',
      searchString: ''
    };

    ExpeditionsService.query({
      byOwner: byOwner,
      byMember: byMember,
    }, function(data) {
      vm.myExpeditions = data;
    });

    vm.findPublishedExpeditions = function() {
      ExpeditionsService.query({
        published: true,
        sort: 'startDate',
        station: vm.filter.station,
        organization: vm.filter.organization,
        team: vm.filter.team,
        teamLead: vm.filter.teamLead,
        startDate: vm.filter.startDate,
        endDate: vm.filter.endDate,
        searchString: vm.filter.searchString
      }, function(data) {
        vm.published = data;
        vm.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        vm.error = error.data.message;
      });
    };
    vm.findPublishedExpeditions();

    $scope.$on('$viewContentLoaded', function(){
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    });

    vm.switchTabs = function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    };

    vm.showAllPublishedExpeditions = function() {
      vm.filter = {
        station: '',
        stationObj: {
          name: 'All'
        },
        stationName: 'All',
        organization: '',
        organizationObj: {
          name: 'All'
        },
        organizationName: 'All',
        team: '',
        teamObj: {
          name: 'All'
        },
        teamName: 'All',
        teamLead: '',
        teamLeadObj: {
          displayName: 'All'
        },
        teamLeadName: 'All',
        startDate: '',
        endDate: '',
        searchString: ''
      };
      vm.findPublishedExpeditions();
    };

    TeamsService.query({
      byOwner: true
    }, function(data) {
      vm.teams = data;
    });

    vm.findTeams = function() {
      TeamsService.query({
        organization: vm.filter.organization
      }, function(data) {
        vm.allTeams = [{
          name: 'All'
        }];
        vm.allTeams = vm.allTeams.concat(data);
        vm.filter.teamObj = vm.allTeams[0];
      });
    };
    vm.findTeams();

    vm.teamSelected = function() {
      vm.filter.team = (vm.filter.teamObj && vm.filter.teamObj._id) ? vm.filter.teamObj._id : '';
      vm.filter.teamName = (vm.filter.teamObj && vm.filter.teamObj._id) ? vm.filter.teamObj.name : '';
      vm.findPublishedExpeditions();
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
      vm.filter.organization = (vm.filter.organizationObj && vm.filter.organizationObj._id) ? vm.filter.organizationObj._id : '';
      vm.filter.organizationName = (vm.filter.organizationObj && vm.filter.organizationObj._id) ? vm.filter.organizationObj.name : '';
      vm.findTeams();
      vm.findPublishedExpeditions();
    };

    vm.getOrganizationName = function(id) {
      var index = lodash.findIndex(vm.organizations, function(o) {
        return o._id === id;
      });
      return (index > -1) ? vm.organizations[index].name : '';
    };

    RestorationStationsService.query({
    }, function(data) {
      vm.stations = [{
        name: 'All'
      }];
      vm.stations = vm.stations.concat(data);
      vm.filter.stationObj = vm.stations[0];
    });

    vm.stationSelected = function() {
      vm.filter.station = (vm.filter.stationObj && vm.filter.stationObj._id) ? vm.filter.stationObj._id : '';
      vm.filter.stationName = (vm.filter.stationObj && vm.filter.stationObj._id) ? vm.filter.stationObj.name : '';
      vm.findPublishedExpeditions();
    };

    TeamLeads.query({
      roles: 'team lead',
      organization: vm.filter.organization
    }, function(data) {
      vm.teamLeads = [{
        displayName: 'All'
      }];
      vm.teamLeads = vm.teamLeads.concat(data);
      vm.filter.teamLeadObj = vm.teamLeads[0];
    });

    vm.teamLeadSelected = function() {
      console.log('selected');
      vm.filter.teamLead = (vm.filter.teamLeadObj && vm.filter.teamLeadObj._id) ? vm.filter.teamLeadObj._id : '';
      vm.filter.teamLeadName = (vm.filter.teamLeadObj && vm.filter.teamLeadObj._id) ? vm.filter.teamLeadObj.displayName : '';

      vm.findPublishedExpeditions();
    };

    vm.dateSelected = function() {
      if (vm.filter.startDate && vm.filter.endDate) {
        vm.findPublishedExpeditions();
      } else if ((!vm.filter.startDate || vm.filter.startDate === undefined || vm.filter.startDate === '') &&
      (!vm.filter.endDate || vm.filter.endDate === undefined || vm.filter.endDate === '')) {
        vm.findPublishedExpeditions();
      }
    };

    vm.searchChange = function() {
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.findPublishedExpeditions();
      }
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

    vm.displayAssignedProtocols = function(expedition) {
      var assigned = [];
      if (vm.checkWrite(expedition.teamLists.siteCondition)) assigned.push('1');
      if (vm.checkWrite(expedition.teamLists.oysterMeasurement)) assigned.push('2');
      if (vm.checkWrite(expedition.teamLists.mobileTrap)) assigned.push('3');
      if (vm.checkWrite(expedition.teamLists.settlementTiles)) assigned.push('4');
      if (vm.checkWrite(expedition.teamLists.waterQuality)) assigned.push('5');
      var formatted = (assigned.length === 1) ? 'Protocol ' : 'Protocols ';
      for (var i = 0; i < assigned.length; i++) {
        formatted += assigned[i];
        if (i === assigned.length - 2 && assigned.length > 1) {
          formatted += ' & ';
        } else if (i < assigned.length - 1 && assigned.length > 1) {
          formatted += ', ';
        }
      }
      return formatted;
    };
  }
})();
