(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsCompareController', ExpeditionsCompareController);

  ExpeditionsCompareController.$inject = ['Authentication', 'ExpeditionsService', 'TeamsService', 'SchoolOrganizationsService',
    'RestorationStationsService', 'TeamLeads', '$rootScope', '$scope', '$stateParams', 'lodash'];

  function ExpeditionsCompareController(Authentication, ExpeditionsService, TeamsService, SchoolOrganizationsService,
    RestorationStationsService, TeamLeads, $rootScope, $scope, $stateParams, lodash) {
    var ce = this;
    ce.user = Authentication.user;

    ce.currentStep = 1;
    ce.totalSteps = 3;
    ce.nextStep = function(step) {
      ce.currentStep = step;
    };

    ce.opened = {
      startDate: false,
      endDate: false
    };
    ce.maxDate = new Date();
    ce.format = 'MM/dd/yyyy';
    ce.shortFormat = 'MM/yyyy';
    ce.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false
    };

    ce.openStartDate = function($event) {
      ce.opened.startDate = true;
    };

    ce.openEndDate = function($event) {
      ce.opened.endDate = true;
    };

    ce.filter = {
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

    ce.findCompareExpeditions = function() {
      ExpeditionsService.query({
        published: true,
        sort: 'startDate',
        station: ce.filter.station,
        organization: ce.filter.organization,
        team: ce.filter.team,
        teamLead: ce.filter.teamLead,
        startDate: ce.filter.startDate,
        endDate: ce.filter.endDate,
        searchString: ce.filter.searchString
      }, function(data) {
        ce.expeditions = data;
        ce.error = null;
      }, function(error) {
        ce.error = error.data.message;
      });
    };
    ce.findCompareExpeditions();

    ce.resetFilters = function() {
      ce.filter = {
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
      ce.findCompareExpeditions();
    };
    $scope.resetFilters = ce.resetFilters;

    ce.findTeams = function() {
      TeamsService.query({
        organization: ce.filter.organization
      }, function(data) {
        ce.teams = [{
          name: 'All'
        }];
        ce.teams = ce.teams.concat(data);
        ce.filter.teamObj = ce.teams[0];
      });
    };
    ce.findTeams();

    ce.teamSelected = function() {
      ce.filter.team = (ce.filter.teamObj && ce.filter.teamObj._id) ? ce.filter.teamObj._id : '';
      ce.filter.teamName = (ce.filter.teamObj && ce.filter.teamObj._id) ? ce.filter.teamObj.name : '';
      ce.findCompareExpeditions();
    };

    SchoolOrganizationsService.query({
      sort: 'name'
    }, function(data) {
      ce.organizations = [{
        name: 'All'
      }];
      ce.organizations = ce.organizations.concat(data);
      ce.filter.organizationObj = ce.organizations[0];
    });

    ce.organizationSelected = function() {
      ce.filter.organization = (ce.filter.organizationObj && ce.filter.organizationObj._id) ? ce.filter.organizationObj._id : '';
      ce.filter.organizationName = (ce.filter.organizationObj && ce.filter.organizationObj._id) ? ce.filter.organizationObj.name : '';
      ce.findTeams();
      ce.findCompareExpeditions();
    };

    RestorationStationsService.query({
    }, function(data) {
      ce.stations = [{
        name: 'All'
      }];
      ce.stations = ce.stations.concat(data);
      ce.filter.stationObj = ce.stations[0];
    });

    ce.stationSelected = function() {
      ce.filter.station = (ce.filter.stationObj && ce.filter.stationObj._id) ? ce.filter.stationObj._id : '';
      ce.filter.stationName = (ce.filter.stationObj && ce.filter.stationObj._id) ? ce.filter.stationObj.name : '';
      ce.findCompareExpeditions();
    };

    TeamLeads.query({
      roles: 'team lead',
      organization: ce.filter.organization
    }, function(data) {
      ce.teamLeads = [{
        displayName: 'All'
      }];
      ce.teamLeads = ce.teamLeads.concat(data);
      ce.filter.teamLeadObj = ce.teamLeads[0];
    });

    ce.teamLeadSelected = function() {
      ce.filter.teamLead = (ce.filter.teamLeadObj && ce.filter.teamLeadObj._id) ? ce.filter.teamLeadObj._id : '';
      ce.filter.teamLeadName = (ce.filter.teamLeadObj && ce.filter.teamLeadObj._id) ? ce.filter.teamLeadObj.displayName : '';

      ce.findCompareExpeditions();
    };

    ce.dateSelected = function() {
      if (ce.filter.startDate && ce.filter.endDate) {
        ce.findCompareExpeditions();
      }
    };

    ce.searchChange = function() {
      if (ce.filter.searchString.length >= 3 || ce.filter.searchString.length === 0) {
        ce.findCompareExpeditions();
      }
    };

    ce.parameters = {
      protocol1all: '',
      protocol1: {
        weatherTemperature: '',
        windSpeedDirection: '',
        humidity: '',
        recentRainfall: '',
        closestHighTideTime: '',
        closestLowTideTime: '',
        closestHighTideHeight: '',
        closestLowTideHeight: '',
        referencePoint: '',
        tidalCurrent: '',
        surfaceCurrentSpeed: '',
        waterColor: '',
        oilSheen: '',
        garbageWater: '',
        pipes: '',
        shorelineType: '',
        garbageLand: '',
        surfaceCover: ''
      },
      protocol2all: '',
      protocol2: {
        submergedDepth: '',
        bioaccumulationOnCase: '',
        cageDamage: '',
        setDate: '',
        source: '',
        liveOystersBaseline: '',
        liveOystersMonitoring: '',
        totalMass: '',
        oysterMeasurements: ''
      },
      protocol3all: '',
      protocol3: {
        organism: ''
      },
      protocol4all: '',
      protocol4: {
        description: '',
        organism: ''
      },
      protocol5all: '',
      protocol5: {
        depth: '',
        temperature: '',
        dissolvedOxygen: '',
        salinity: '',
        pH: '',
        turbidity: '',
        ammonia: '',
        nitrates: '',
        other: ''
      }
    };

    ce.dataPointCount = function() {
      var protocols = ['protocol1', 'protocol2', 'protocol3', 'protocol4', 'protocol5'];
      var count = 0;
      for (var i = 0; i < protocols.length; i++) {
        var protocol = protocols[i];
        for (var param in ce.parameters[protocol]) {
          if(ce.parameters[protocol][param] === 'YES'){
            count++;
          }
        }
      }
      return count;
    };

    ce.dataPointProtocol1Count = function() {
      ce.protocol1paramCount = 0;
      for (var param in ce.parameters.protocol1) {
        if(ce.parameters.protocol1[param] === 'YES'){
          ce.protocol1paramCount++;
        }
      }
      console.log('protocol1 ' + ce.protocol1paramCount);
      return ce.protocol1paramCount;
    };

    ce.dataPointProtocol2Count = function() {
      ce.protocol2paramCount = 0;
      for (var param in ce.parameters.protocol2) {
        if(ce.parameters.protocol2[param] === 'YES'){
          ce.protocol2paramCount++;
        }
      }
      console.log('protocol2 ' + ce.protocol2paramCount);
      return ce.protocol2paramCount;
    };

    ce.dataPointProtocol3Count = function() {
      ce.protocol3paramCount = 0;
      for (var param in ce.parameters.protocol3) {
        if(ce.parameters.protocol3[param] === 'YES'){
          ce.protocol3paramCount++;
        }
      }
      console.log('protocol3 ' + ce.protocol3paramCount);
      return ce.protocol3paramCount;
    };

    ce.dataPointProtocol4Count = function() {
      ce.protocol4paramCount = 0;
      for (var param in ce.parameters.protocol4) {
        if(ce.parameters.protocol4[param] === 'YES'){
          ce.protocol4paramCount++;
        }
      }
      console.log('protocol 4 ' + ce.protocol4paramCount);
      return ce.protocol4paramCount;
    };

    ce.dataPointProtocol5Count = function() {
      ce.protocol5paramCount = 0;
      for (var param in ce.parameters.protocol5) {
        if(ce.parameters.protocol5[param] === 'YES'){
          ce.protocol5paramCount++;
        }
      }
      console.log('protocol 5 ' + ce.protocol5paramCount);
      return ce.protocol5paramCount;
    };

    ce.cancelFunction = function() {
      console.log('cancel');
    };
  }
})();
