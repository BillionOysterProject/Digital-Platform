(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsCompareController', ExpeditionsCompareController);

  ExpeditionsCompareController.$inject = ['Authentication', 'ExpeditionsService', 'TeamsService', 'SchoolOrganizationsService',
  'ExpeditionViewHelper',
  'RestorationStationsService', 'TeamLeads', '$rootScope', '$scope', '$stateParams', '$http', 'lodash', 'moment'];

  function ExpeditionsCompareController(Authentication, ExpeditionsService, TeamsService, SchoolOrganizationsService,
    ExpeditionViewHelper,
    RestorationStationsService, TeamLeads, $rootScope, $scope, $stateParams, $http, lodash, moment) {
    var ce = this;
    ce.user = Authentication.user;

    ce.currentStep = 1;
    ce.totalSteps = 3;
    ce.nextStep = function(step) {
      if (step === 3) {
        ce.compare();
      }
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
      ce.currentStep = 1;
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
          bioaccumulationOnCage: '',
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
      console.log('organizationSelected');
      ce.filter.organization = (ce.filter.organizationObj && ce.filter.organizationObj._id) ? ce.filter.organizationObj._id : '';
      ce.filter.organizationName = (ce.filter.organizationObj && ce.filter.organizationObj.name) ? ce.filter.organizationObj.name : '';
      console.log('ce.filter.organization', ce.filter.organization);
      console.log('ce.filter.organizationName', ce.filter.organizationName);
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
        bioaccumulationOnCage: '',
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

    ce.toggleProtocol1 = function() {
      if (ce.parameters.protocol1all === 'YES') {
        ce.parameters.protocol1.weatherTemperature = 'YES';
        ce.parameters.protocol1.windSpeedDirection = 'YES';
        ce.parameters.protocol1.humidity = 'YES';
        ce.parameters.protocol1.recentRainfall = 'YES';
        ce.parameters.protocol1.closestHighTideTime = 'YES';
        ce.parameters.protocol1.closestLowTideTime = 'YES';
        ce.parameters.protocol1.closestHighTideHeight = 'YES';
        ce.parameters.protocol1.closestLowTideHeight = 'YES';
        ce.parameters.protocol1.referencePoint = 'YES';
        ce.parameters.protocol1.tidalCurrent = 'YES';
        ce.parameters.protocol1.surfaceCurrentSpeed = 'YES';
        ce.parameters.protocol1.waterColor = 'YES';
        ce.parameters.protocol1.oilSheen = 'YES';
        ce.parameters.protocol1.garbageWater = 'YES';
        ce.parameters.protocol1.pipes = 'YES';
        ce.parameters.protocol1.shorelineType = 'YES';
        ce.parameters.protocol1.garbageLand = 'YES';
        ce.parameters.protocol1.surfaceCover = 'YES';
      } else {
        ce.parameters.protocol1.weatherTemperature = '';
        ce.parameters.protocol1.windSpeedDirection = '';
        ce.parameters.protocol1.humidity = '';
        ce.parameters.protocol1.recentRainfall = '';
        ce.parameters.protocol1.closestHighTideTime = '';
        ce.parameters.protocol1.closestLowTideTime = '';
        ce.parameters.protocol1.closestHighTideHeight = '';
        ce.parameters.protocol1.closestLowTideHeight = '';
        ce.parameters.protocol1.referencePoint = '';
        ce.parameters.protocol1.tidalCurrent = '';
        ce.parameters.protocol1.surfaceCurrentSpeed = '';
        ce.parameters.protocol1.waterColor = '';
        ce.parameters.protocol1.oilSheen = '';
        ce.parameters.protocol1.garbageWater = '';
        ce.parameters.protocol1.pipes = '';
        ce.parameters.protocol1.shorelineType = '';
        ce.parameters.protocol1.garbageLand = '';
        ce.parameters.protocol1.surfaceCover = '';
      }
    };

    ce.toggleProtocol2 = function() {
      if (ce.parameters.protocol2all === 'YES') {
        ce.parameters.protocol2.submergedDepth = 'YES';
        ce.parameters.protocol2.bioaccumulationOnCage = 'YES';
        ce.parameters.protocol2.cageDamage = 'YES';
        ce.parameters.protocol2.setDate = 'YES';
        ce.parameters.protocol2.source = 'YES';
        ce.parameters.protocol2.liveOystersBaseline = 'YES';
        ce.parameters.protocol2.liveOystersMonitoring = 'YES';
        ce.parameters.protocol2.totalMass = 'YES';
        ce.parameters.protocol2.oysterMeasurements = 'YES';
      } else {
        ce.parameters.protocol2.submergedDepth = '';
        ce.parameters.protocol2.bioaccumulationOnCage = '';
        ce.parameters.protocol2.cageDamage = '';
        ce.parameters.protocol2.setDate = '';
        ce.parameters.protocol2.source = '';
        ce.parameters.protocol2.liveOystersBaseline = '';
        ce.parameters.protocol2.liveOystersMonitoring = '';
        ce.parameters.protocol2.totalMass = '';
        ce.parameters.protocol2.oysterMeasurements = '';
      }
    };

    ce.toggleProtocol3 = function() {
      if (ce.parameters.protocol3all === 'YES') {
        ce.parameters.protocol3.organism = 'YES';
      } else {
        ce.parameters.protocol3.organism = '';
      }
    };

    ce.toggleProtocol4 = function() {
      if (ce.parameters.protocol4all === 'YES') {
        ce.parameters.protocol4.description = 'YES';
        ce.parameters.protocol4.organism = 'YES';
      } else {
        ce.parameters.protocol4.description = '';
        ce.parameters.protocol4.organism = '';
      }
    };

    ce.toggleProtocol5 = function() {
      if (ce.parameters.protocol5all === 'YES') {
        ce.parameters.protocol5.depth = 'YES';
        ce.parameters.protocol5.temperature = 'YES';
        ce.parameters.protocol5.dissolvedOxygen = 'YES';
        ce.parameters.protocol5.salinity = 'YES';
        ce.parameters.protocol5.pH = 'YES';
        ce.parameters.protocol5.turbidity = 'YES';
        ce.parameters.protocol5.ammonia = 'YES';
        ce.parameters.protocol5.nitrates = 'YES';
        ce.parameters.protocol5.other = 'YES';
      } else {
        ce.parameters.protocol5.depth = '';
        ce.parameters.protocol5.temperature = '';
        ce.parameters.protocol5.dissolvedOxygen = '';
        ce.parameters.protocol5.salinity = '';
        ce.parameters.protocol5.pH = '';
        ce.parameters.protocol5.turbidity = '';
        ce.parameters.protocol5.ammonia = '';
        ce.parameters.protocol5.nitrates = '';
        ce.parameters.protocol5.other = '';
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
      return ce.protocol1paramCount;
    };

    ce.dataPointProtocol2Count = function() {
      ce.protocol2paramCount = 0;
      for (var param in ce.parameters.protocol2) {
        if(ce.parameters.protocol2[param] === 'YES'){
          ce.protocol2paramCount++;
        }
      }
      return ce.protocol2paramCount;
    };

    ce.dataPointProtocol3Count = function() {
      ce.protocol3paramCount = 0;
      for (var param in ce.parameters.protocol3) {
        if(ce.parameters.protocol3[param] === 'YES'){
          ce.protocol3paramCount++;
        }
      }
      return ce.protocol3paramCount;
    };

    ce.dataPointProtocol4Count = function() {
      ce.protocol4paramCount = 0;
      for (var param in ce.parameters.protocol4) {
        if(ce.parameters.protocol4[param] === 'YES'){
          ce.protocol4paramCount++;
        }
      }
      return ce.protocol4paramCount;
    };

    ce.dataPointProtocol5Count = function() {
      ce.protocol5paramCount = 0;
      for (var param in ce.parameters.protocol5) {
        if(ce.parameters.protocol5[param] === 'YES'){
          ce.protocol5paramCount++;
        }
      }
      return ce.protocol5paramCount;
    };

    ce.cancelFunction = function() {
      console.log('cancel');
    };

    ce.compare = function() {
      var expeditionIds = [];
      for (var i = 0; i < ce.expeditions.length; i++) {
        expeditionIds.push(ce.expeditions[i]._id);
      }
      console.log('ce.parameters.protocol5all', ce.parameters.protocol5all);
      console.log('ce.parameters.protocol5', ce.parameters.protocol5);

      $http.post('/api/expeditions/compare', {
        expeditionIds: expeditionIds,
        protocol1: ce.parameters.protocol1,
        protocol2: ce.parameters.protocol2,
        protocol3: ce.parameters.protocol3,
        protocol4: ce.parameters.protocol4,
        protocol5: ce.parameters.protocol5
      }).
      success(function(data, status, headers, config) {
        console.log('expeditions', data);
        ce.compareExpeditions = data;
      }).
      error(function(data, status, headers, config) {
        console.log('error', data);
      });
    };

    ce.getExpeditionDate = ExpeditionViewHelper.getExpeditionDate;
    ce.getTime = ExpeditionViewHelper.getTime;
    ce.getShortDate = ExpeditionViewHelper.getShortDate;
    ce.getDate = ExpeditionViewHelper.getDate;

    ce.getWeatherCondition = ExpeditionViewHelper.getWeatherCondition;
    ce.getWaterColors = ExpeditionViewHelper.getWaterColors;
    ce.getWaterFlows = ExpeditionViewHelper.getWaterFlows;
    ce.getShorelineTypes = ExpeditionViewHelper.getShorelineTypes;
    ce.getWindDirection = ExpeditionViewHelper.getWindDirection;
    ce.getGarbageExtent = ExpeditionViewHelper.getGarbageExtent;
    ce.getMobileOrganismById = ExpeditionViewHelper.getMobileOrganismById;
    ce.getSessileOrganismName = ExpeditionViewHelper.getSessileOrganismName;
    ce.getWaterTemperatureMethod = ExpeditionViewHelper.getWaterTemperatureMethod;
    ce.getDissolvedOxygenMethod = ExpeditionViewHelper.getDissolvedOxygenMethod;
    ce.getSalinityMethod = ExpeditionViewHelper.getSalinityMethod;
    ce.getPHMethod = ExpeditionViewHelper.getPHMethod;
    ce.getTurbidityMethod = ExpeditionViewHelper.getTurbidityMethod;
    ce.getAmmoniaMethod = ExpeditionViewHelper.getAmmoniaMethod;
    ce.getNitratesMethod = ExpeditionViewHelper.getNitratesMethod;
    ce.getDissolvedOxygenUnit = ExpeditionViewHelper.getDissolvedOxygenUnit;
    ce.getSalinityUnit = ExpeditionViewHelper.getSalinityUnit;
    ce.getPHUnits = ExpeditionViewHelper.getPHUnits;
    ce.getTurbidityUnit = ExpeditionViewHelper.getTurbidityUnit;
    ce.getAmmoniaUnit = ExpeditionViewHelper.getAmmoniaUnit;
    ce.getNitratesUnit = ExpeditionViewHelper.getNitratesUnit;

    ce.getMobileOrganismName = function(id) {
      var organism = ce.getMobileOrganismById(id);
      return (organism) ? organism.commonName : '';
    };
  }
})();
