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
      searchString: '',
      limit: 15,
      page: 1
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

    vm.findMyExpeditions = function() {
      ExpeditionsService.query({
        byOwner: byOwner,
        byMember: byMember,
        limit: vm.filter.limit,
        page: vm.filter.page
      }, function(data) {
        vm.filterLength = data.totalCount;
        vm.itemsPerPage = vm.filter.limit;
        vm.myExpeditions = data.expeditions;
        $timeout(function() {
        });
      });
    };
    vm.findMyExpeditions();

    vm.pageChanged = function() {
      vm.filter.page = vm.currentPage;
      vm.findMyExpeditions();
    };

    vm.findPublishedExpeditions = function() {
      ExpeditionsService.query({
        published: true,
        sort: 'startDateRev',
        station: vm.filter.station,
        organization: vm.filter.organization,
        team: vm.filter.team,
        teamLead: vm.filter.teamLead,
        startDate: vm.filter.startDate,
        endDate: vm.filter.endDate,
        searchString: vm.filter.searchString,
        limit: vm.filter.limit,
        page: vm.filter.page
      }, function(data) {
        vm.filterLength = data.totalCount;
        vm.itemsPerPage = vm.filter.limit;
        vm.published = data.expeditions;
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
      vm.filter.page = 1;
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    };

    vm.resetFilters = function() {
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
        searchString: '',
        limit: 15,
        page: 1
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

    vm.getTeamLead = function(id) {
      var index = lodash.findIndex(vm.teamLeads, function(l) {
        return l._id === id;
      });
      return (index > -1) ? vm.teamLeads[index] : id;
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

    vm.teamLeadSelected = function() {
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
  }
})();
