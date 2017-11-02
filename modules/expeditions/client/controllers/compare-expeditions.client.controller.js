(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsCompareController', ExpeditionsCompareController);

  ExpeditionsCompareController.$inject = ['Authentication', 'ExpeditionsService', 'TeamsService', 'SchoolOrganizationsService',
    'ExpeditionViewHelper', 'RestorationStationsService', 'TeamLeads', '$rootScope', '$scope', '$stateParams',
    '$http', '$location', '$anchorScroll', '$timeout', '$window', 'lodash', 'moment'];

  function ExpeditionsCompareController(Authentication, ExpeditionsService, TeamsService, SchoolOrganizationsService,
    ExpeditionViewHelper, RestorationStationsService, TeamLeads, $rootScope, $scope, $stateParams,
    $http, $location, $anchorScroll, $timeout, $window, lodash, moment) {
    var vm = this;
    vm.user = Authentication.user;
    vm.filtered = false;

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

    vm.findCompareExpeditions = function(callback) {
      ExpeditionsService.query({
        published: true,
        sort: 'startDate',
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
        console.log('expeditions', data.expeditions);
        vm.filterLength = data.totalCount;
        vm.itemsPerPage = vm.filter.limit;
        vm.expeditions = data.expeditions;
        if (vm.filtered) vm.compare();
        vm.error = null;
        if (callback) callback();
      }, function(error) {
        vm.error = error.data.message;
      });
    };

    vm.pageChanged = function() {
      vm.filter.page = vm.currentPage;
      vm.findCompareExpeditions();
    };

    vm.resetFilters = function() {
      vm.filtered = false;
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
      vm.parameters = {
        protocol1all: '',
        protocol1: {
          weatherTemperature: '',
          windSpeedDirection: '',
          humidity: '',
          recentRainfall: '',
          tide: '',
          referencePoint: '',
          tidalCurrent: '',
          waterConditionPhoto: '',
          surfaceCurrentSpeed: '',
          waterColor: '',
          oilSheen: '',
          garbageWater: '',
          pipes: '',
          landConditionPhoto: '',
          shorelineType: '',
          garbageLand: '',
          surfaceCover: ''
        },
        protocol2all: '',
        protocol2: {
          submergedDepth: '',
          oysterCagePhoto: '',
          bioaccumulationOnCage: '',
          cageDamage: '',
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
      vm.findCompareExpeditions();
    };
    $scope.resetFilters = vm.resetFilters;

    vm.findTeams = function() {
      TeamsService.query({
        organization: vm.filter.organization
      }, function(data) {
        vm.teams = [{
          name: 'All'
        }];
        vm.teams = vm.teams.concat(data);
        vm.filter.teamObj = vm.teams[0];
      });
    };
    vm.findTeams();

    vm.teamSelected = function() {
      vm.filtered = true;
      vm.filter.team = (vm.filter.teamObj && vm.filter.teamObj._id) ? vm.filter.teamObj._id : '';
      vm.filter.teamName = (vm.filter.teamObj && vm.filter.teamObj.name) ? vm.filter.teamObj.name : '';
      vm.findCompareExpeditions();
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
      vm.findTeams();
      vm.findCompareExpeditions();
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
      vm.filtered = true;
      vm.filter.station = (vm.filter.stationObj && vm.filter.stationObj._id) ? vm.filter.stationObj._id : '';
      vm.filter.stationName = (vm.filter.stationObj && vm.filter.stationObj.name) ? vm.filter.stationObj.name : '';
      vm.findCompareExpeditions();
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
      vm.filtered = true;
      vm.filter.teamLead = (vm.filter.teamLeadObj && vm.filter.teamLeadObj._id) ? vm.filter.teamLeadObj._id : '';
      vm.filter.teamLeadName = (vm.filter.teamLeadObj && vm.filter.teamLeadObj.displayName) ? vm.filter.teamLeadObj.displayName : '';

      vm.findCompareExpeditions();
    };

    vm.dateSelected = function() {
      if (vm.filter.startDate && vm.filter.endDate) {
        vm.filtered = true;
        vm.findCompareExpeditions();
      } else if ((!vm.filter.startDate || vm.filter.startDate === undefined || vm.filter.startDate === '') &&
      (!vm.filter.endDate || vm.filter.endDate === undefined || vm.filter.endDate === '')) {
        vm.filtered = true;
        vm.findCompareExpeditions();
      }
    };

    vm.searchChange = function() {
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.filtered = true;
        vm.findCompareExpeditions();
      }
    };

    vm.parameters = {
      protocol1all: '',
      protocol1: {
        weatherTemperature: '',
        windSpeedDirection: '',
        humidity: '',
        recentRainfall: '',
        tide: '',
        referencePoint: '',
        tidalCurrent: '',
        waterConditionPhoto: '',
        surfaceCurrentSpeed: '',
        waterColor: '',
        oilSheen: '',
        garbageWater: '',
        pipes: '',
        landConditionPhoto: '',
        shorelineType: '',
        garbageLand: '',
        surfaceCover: ''
      },
      protocol2all: '',
      protocol2: {
        submergedDepth: '',
        oysterCagePhoto: '',
        bioaccumulationOnCage: '',
        cageDamage: '',
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

    vm.toggleProtocol1 = function() {
      vm.filtered = true;
      if (vm.parameters.protocol1all === 'YES') {
        vm.parameters.protocol1.weatherTemperature = 'YES';
        vm.parameters.protocol1.windSpeedDirection = 'YES';
        vm.parameters.protocol1.humidity = 'YES';
        vm.parameters.protocol1.recentRainfall = 'YES';
        vm.parameters.protocol1.tide = 'YES';
        vm.parameters.protocol1.referencePoint = 'YES';
        vm.parameters.protocol1.tidalCurrent = 'YES';
        vm.parameters.protocol1.waterConditionPhoto = 'YES';
        vm.parameters.protocol1.surfaceCurrentSpeed = 'YES';
        vm.parameters.protocol1.waterColor = 'YES';
        vm.parameters.protocol1.oilSheen = 'YES';
        vm.parameters.protocol1.garbageWater = 'YES';
        vm.parameters.protocol1.pipes = 'YES';
        vm.parameters.protocol1.landConditionPhoto = 'YES';
        vm.parameters.protocol1.shorelineType = 'YES';
        vm.parameters.protocol1.garbageLand = 'YES';
        vm.parameters.protocol1.surfaceCover = 'YES';
      } else {
        vm.parameters.protocol1.weatherTemperature = '';
        vm.parameters.protocol1.windSpeedDirection = '';
        vm.parameters.protocol1.humidity = '';
        vm.parameters.protocol1.recentRainfall = '';
        vm.parameters.protocol1.tide = '';
        vm.parameters.protocol1.referencePoint = '';
        vm.parameters.protocol1.tidalCurrent = '';
        vm.parameters.protocol1.waterConditionPhoto = '';
        vm.parameters.protocol1.surfaceCurrentSpeed = '';
        vm.parameters.protocol1.waterColor = '';
        vm.parameters.protocol1.oilSheen = '';
        vm.parameters.protocol1.garbageWater = '';
        vm.parameters.protocol1.pipes = '';
        vm.parameters.protocol1.landConditionPhoto = '';
        vm.parameters.protocol1.shorelineType = '';
        vm.parameters.protocol1.garbageLand = '';
        vm.parameters.protocol1.surfaceCover = '';
      }
      vm.compare();
    };

    vm.toggleProtocol2 = function() {
      vm.filtered = true;
      if (vm.parameters.protocol2all === 'YES') {
        vm.parameters.protocol2.submergedDepth = 'YES';
        vm.parameters.protocol2.oysterCagePhoto = 'YES';
        vm.parameters.protocol2.bioaccumulationOnCage = 'YES';
        vm.parameters.protocol2.cageDamage = 'YES';
        vm.parameters.protocol2.oysterMeasurements = 'YES';
      } else {
        vm.parameters.protocol2.submergedDepth = '';
        vm.parameters.protocol2.oysterCagePhoto = '';
        vm.parameters.protocol2.bioaccumulationOnCage = '';
        vm.parameters.protocol2.cageDamage = '';
        vm.parameters.protocol2.oysterMeasurements = '';
      }
      vm.compare();
    };

    vm.toggleProtocol3 = function() {
      vm.filtered = true;
      if (vm.parameters.protocol3all === 'YES') {
        vm.parameters.protocol3.organism = 'YES';
      } else {
        vm.parameters.protocol3.organism = '';
      }
      vm.compare();
    };

    vm.toggleProtocol4 = function() {
      vm.filtered = true;
      if (vm.parameters.protocol4all === 'YES') {
        vm.parameters.protocol4.description = 'YES';
        vm.parameters.protocol4.organism = 'YES';
      } else {
        vm.parameters.protocol4.description = '';
        vm.parameters.protocol4.organism = '';
      }
      vm.compare();
    };

    vm.toggleProtocol5 = function() {
      vm.filtered = true;
      if (vm.parameters.protocol5all === 'YES') {
        vm.parameters.protocol5.depth = 'YES';
        vm.parameters.protocol5.temperature = 'YES';
        vm.parameters.protocol5.dissolvedOxygen = 'YES';
        vm.parameters.protocol5.salinity = 'YES';
        vm.parameters.protocol5.pH = 'YES';
        vm.parameters.protocol5.turbidity = 'YES';
        vm.parameters.protocol5.ammonia = 'YES';
        vm.parameters.protocol5.nitrates = 'YES';
        vm.parameters.protocol5.other = 'YES';
      } else {
        vm.parameters.protocol5.depth = '';
        vm.parameters.protocol5.temperature = '';
        vm.parameters.protocol5.dissolvedOxygen = '';
        vm.parameters.protocol5.salinity = '';
        vm.parameters.protocol5.pH = '';
        vm.parameters.protocol5.turbidity = '';
        vm.parameters.protocol5.ammonia = '';
        vm.parameters.protocol5.nitrates = '';
        vm.parameters.protocol5.other = '';
      }
      vm.compare();
    };

    vm.dataPointCount = function() {
      var protocols = ['protocol1', 'protocol2', 'protocol3', 'protocol4', 'protocol5'];
      var count = 0;
      for (var i = 0; i < protocols.length; i++) {
        var protocol = protocols[i];
        for (var param in vm.parameters[protocol]) {
          if(vm.parameters[protocol][param] === 'YES'){
            count++;
          }
        }
      }
      return count;
    };

    vm.dataPointProtocol1Count = function() {
      vm.protocol1paramCount = 0;
      for (var param in vm.parameters.protocol1) {
        if(vm.parameters.protocol1[param] === 'YES'){
          vm.protocol1paramCount++;
        }
      }
      return vm.protocol1paramCount;
    };

    vm.dataPointProtocol2Count = function() {
      vm.protocol2paramCount = 0;
      for (var param in vm.parameters.protocol2) {
        if(vm.parameters.protocol2[param] === 'YES'){
          vm.protocol2paramCount++;
        }
      }
      return vm.protocol2paramCount;
    };

    vm.dataPointProtocol3Count = function() {
      vm.protocol3paramCount = 0;
      for (var param in vm.parameters.protocol3) {
        if(vm.parameters.protocol3[param] === 'YES'){
          vm.protocol3paramCount++;
        }
      }
      return vm.protocol3paramCount;
    };

    vm.dataPointProtocol4Count = function() {
      vm.protocol4paramCount = 0;
      for (var param in vm.parameters.protocol4) {
        if(vm.parameters.protocol4[param] === 'YES'){
          vm.protocol4paramCount++;
        }
      }
      return vm.protocol4paramCount;
    };

    vm.dataPointProtocol5Count = function() {
      vm.protocol5paramCount = 0;
      for (var param in vm.parameters.protocol5) {
        if(vm.parameters.protocol5[param] === 'YES'){
          vm.protocol5paramCount++;
        }
      }
      return vm.protocol5paramCount;
    };

    vm.cancelFunction = function() {
    };

    vm.compare = function() {
      vm.filtered = true;
      var expeditionIds = [];
      for (var i = 0; i < vm.expeditions.length; i++) {
        expeditionIds.push(vm.expeditions[i]._id);
      }

      $http.post('/api/expeditions/compare', {
        expeditionIds: expeditionIds,
        protocol1: vm.parameters.protocol1,
        protocol2: vm.parameters.protocol2,
        protocol3: vm.parameters.protocol3,
        protocol4: vm.parameters.protocol4,
        protocol5: vm.parameters.protocol5
      }).
      success(function(data, status, headers, config) {
        vm.compareExpeditions = data;
        for (var i = 0; i < vm.compareExpeditions.length; i++) {
          var totalDepthOfWaterSampleM = 0;
          var countDepthOfWaterSampleM = 0;
          var totalWaterTemperatureC = 0;
          var countWaterTemperature = 0;
          var totalDissolvedOxygen = 0;
          var countDissolvedOxygen = 0;
          var totalSalinity = 0;
          var countSalinity = 0;
          var totalPH = 0;
          var countPH = 0;
          var totalTurbidity = 0;
          var countTurbidity = 0;
          var totalAmmonia = 0;
          var countAmmonia = 0;
          var totalNitrates = 0;
          var countNitrates = 0;
          var avgOther = {};

          if(vm.compareExpeditions[i] && vm.compareExpeditions[i].protocols &&
            vm.compareExpeditions[i].protocols.mobileTrap &&
            vm.compareExpeditions[i].protocols.mobileTrap.mobileOrganisms) {
            var mobileOrganisms = vm.compareExpeditions[i].protocols.mobileTrap.mobileOrganisms;
            if(mobileOrganisms.length > 0) {
              mobileOrganisms = lodash.chunk(mobileOrganisms, 4);
              vm.compareExpeditions[i].protocols.mobileTrap.mobileOrganismsChunked = mobileOrganisms;
            }
          }

          if (vm.compareExpeditions[i] && vm.compareExpeditions[i].protocols &&
            vm.compareExpeditions[i].protocols.waterQuality) {
            for (var j = 0; j < vm.compareExpeditions[i].protocols.waterQuality.samples.length; j++) {
              var sample = vm.compareExpeditions[i].protocols.waterQuality.samples[j];
              if (sample.depthOfWaterSampleM) {
                totalDepthOfWaterSampleM += sample.depthOfWaterSampleM;
                countDepthOfWaterSampleM++;
              }
              if (sample.waterTemperature && sample.waterTemperature.average) {
                var cTemp = 0;
                if (sample.waterTemperature.units === 'c') {
                  cTemp = sample.waterTemperature.average;
                } else {
                  cTemp = (sample.waterTemperature.average - 32) / 1.8;
                }
                totalWaterTemperatureC += cTemp;
                countWaterTemperature++;
              }
              if (sample.dissolvedOxygen && sample.dissolvedOxygen.average) {
                totalDissolvedOxygen += sample.dissolvedOxygen.average;
                countDissolvedOxygen++;
              }
              if (sample.salinity && sample.salinity.average) {
                totalSalinity += sample.salinity.average;
                countSalinity++;
              }
              if (sample.pH && sample.pH.average) {
                totalPH += sample.pH.average;
                countPH++;
              }
              if (sample.turbidity && sample.turbidity.average) {
                totalTurbidity += sample.turbidity.average;
                countTurbidity++;
              }
              if (sample.ammonia && sample.ammonia.average) {
                totalAmmonia += sample.ammonia.average;
                countAmmonia++;
              }
              if (sample.nitrates && sample.nitrates.average) {
                totalNitrates += sample.nitrates.average;
                countNitrates++;
              }
              if (sample.others && sample.others[0] && sample.others[0].average && sample.others[0].label) {
                if (avgOther[sample.others[0].label]) {
                  avgOther[sample.others[0].label].total += sample.others[0].average;
                  avgOther[sample.others[0].label].count++;
                } else {
                  avgOther[sample.others[0].label] = {
                    total: sample.others[0].average,
                    count: 1,
                    units: sample.others[0].units,
                    label: sample.others[0].label
                  };
                }
              }
            }

            vm.compareExpeditions[i].protocols.waterQuality.avgSample = {};
            if (totalDepthOfWaterSampleM && countDepthOfWaterSampleM) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.depthOfWaterSampleM = totalDepthOfWaterSampleM/countDepthOfWaterSampleM;
            }
            if (totalWaterTemperatureC && countWaterTemperature) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.waterTemperatureC = totalWaterTemperatureC/countWaterTemperature;
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.waterTemperatureF = (vm.compareExpeditions[i].protocols.waterQuality.avgSample.waterTemperatureC * 9/5 + 32);
            }
            if (totalDissolvedOxygen && countDissolvedOxygen) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.dissolvedOxygen = totalDissolvedOxygen/countDissolvedOxygen;
            }
            if (totalSalinity && countSalinity) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.salinity = totalSalinity/countSalinity;
            }
            if (totalPH && countPH) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.pH = totalPH/countPH;
            }
            if (totalTurbidity && countTurbidity) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.turbidity = totalTurbidity/countTurbidity;
            }
            if (totalAmmonia && countAmmonia) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.ammonia = totalAmmonia/countAmmonia;
            }
            if (totalNitrates && countNitrates) {
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.nitrates = totalNitrates/countNitrates;
            }
            if (Object.keys(avgOther).length > 0) {
              var keys = Object.keys(avgOther);
              vm.compareExpeditions[i].protocols.waterQuality.avgSample.avgOthers = {};
              for (var m = 0; m < keys.length; m++) {
                var key = keys[m];
                vm.compareExpeditions[i].protocols.waterQuality.avgSample.avgOthers[key] = {
                  average: avgOther[key].total/avgOther[key].count,
                  units: avgOther[key].units,
                  label: avgOther[key].label
                };
              }
            }
          }
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error', data);
      });
    };

    //initialize the expeditions chosen and fill in the comparison view
    vm.findCompareExpeditions(vm.compare);

    vm.download = function() {
      var expeditionIds = [];
      for (var i = 0; i < vm.expeditions.length; i++) {
        expeditionIds.push(vm.expeditions[i]._id);
      }

      $http.post('/api/expeditions/export-compare', {
        expeditionIds: expeditionIds,
        protocol1: vm.parameters.protocol1,
        protocol2: vm.parameters.protocol2,
        protocol3: vm.parameters.protocol3,
        protocol4: vm.parameters.protocol4,
        protocol5: vm.parameters.protocol5
      }, { responseType: 'arraybuffer' }).
      success(function(data, status, headers, config) {
        // TODO when WS success
        var file = new Blob([ data ], {
          type : 'application/csv'
        });
        //trick to download store a file having its URL
        var fileURL = URL.createObjectURL(file);
        var a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        a.download = 'export-expeditions.csv';
        document.body.appendChild(a);
        a.click();
      }).
      error(function(data, status, headers, config) {
        console.log('error', data);
      });
    };

    vm.getExpeditionDate = ExpeditionViewHelper.getExpeditionDate;
    vm.getTime = ExpeditionViewHelper.getTime;
    vm.getShortDate = ExpeditionViewHelper.getShortDate;
    vm.getDate = ExpeditionViewHelper.getDate;

    vm.getWeatherCondition = ExpeditionViewHelper.getWeatherCondition;
    vm.getWaterColors = ExpeditionViewHelper.getWaterColors;
    vm.getWaterFlows = ExpeditionViewHelper.getWaterFlows;
    vm.getShorelineTypes = ExpeditionViewHelper.getShorelineTypes;
    vm.getWindDirection = ExpeditionViewHelper.getWindDirection;
    vm.getGarbageExtent = ExpeditionViewHelper.getGarbageExtent;
    vm.getMobileOrganismById = ExpeditionViewHelper.getMobileOrganismById;
    vm.getSessileOrganismName = ExpeditionViewHelper.getSessileOrganismName;
    vm.getSessileOrganismPhoto = ExpeditionViewHelper.getSessileOrganismPhoto;
    vm.getWaterTemperatureMethod = ExpeditionViewHelper.getWaterTemperatureMethod;
    vm.getDissolvedOxygenMethod = ExpeditionViewHelper.getDissolvedOxygenMethod;
    vm.getSalinityMethod = ExpeditionViewHelper.getSalinityMethod;
    vm.getPHMethod = ExpeditionViewHelper.getPHMethod;
    vm.getTurbidityMethod = ExpeditionViewHelper.getTurbidityMethod;
    vm.getAmmoniaMethod = ExpeditionViewHelper.getAmmoniaMethod;
    vm.getNitratesMethod = ExpeditionViewHelper.getNitratesMethod;
    vm.getDissolvedOxygenUnit = ExpeditionViewHelper.getDissolvedOxygenUnit;
    vm.getSalinityUnit = ExpeditionViewHelper.getSalinityUnit;
    vm.getPHUnits = ExpeditionViewHelper.getPHUnits;
    vm.getTurbidityUnit = ExpeditionViewHelper.getTurbidityUnit;
    vm.getAmmoniaUnit = ExpeditionViewHelper.getAmmoniaUnit;
    vm.getNitratesUnit = ExpeditionViewHelper.getNitratesUnit;

    vm.getMobileOrganismName = function(id) {
      var organism = vm.getMobileOrganismById(id);
      return (organism) ? organism.commonName : '';
    };

    vm.getMobileOrganismPhoto = function(sketchPhoto, id) {
      if (sketchPhoto && sketchPhoto.path) {
        return sketchPhoto.path;
      } else {
        var organism = vm.getMobileOrganismById(id);
        return (organism && organism.image) ? organism.image.path : '';
      }
    };

  }
})();
