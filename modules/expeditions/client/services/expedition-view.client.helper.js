(function() {
  'use strict';

  angular
    .module('expeditions.services')
    .factory('ExpeditionViewHelper', ExpeditionViewHelper);

  ExpeditionViewHelper.$inject = ['WeatherConditionsService', 'WaterColorsService',
  'WaterFlowService', 'ShorelineTypesService', 'MobileOrganismsService', 'SessileOrganismsService',
  'lodash', 'moment'];

  function ExpeditionViewHelper(WeatherConditionsService, WaterColorsService,
    WaterFlowService, ShorelineTypesService, MobileOrganismsService, SessileOrganismsService,
    lodash, moment) {
    var weatherConditions = WeatherConditionsService.query();
    var waterColors = WaterColorsService.query();
    var waterFlows = WaterFlowService.query();
    var shorelineTypes = ShorelineTypesService.query();
    var mobileOrganisms = MobileOrganismsService.query();
    var sessileOrganisms = SessileOrganismsService.query();

    var garbageExtent = [
      { label: 'None', value: 'none' },
      { label: 'Sporadic', value: 'sporadic' },
      { label: 'Common', value: 'common' },
      { label: 'Extensive', value: 'extensive' }
    ];

    var windDirection = [
      { label: 'North', value: 'north' },
      { label: 'North West', value: 'northwest' },
      { label: 'West', value: 'west' },
      { label: 'South West', value: 'southwest' },
      { label: 'South', value: 'south' },
      { label: 'South East', value: 'southeast' },
      { label: 'East', value: 'east' },
      { label: 'North East', value: 'northeast' }
    ];

    var trueFalse = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];


    return {
      getAllWeatherConditions: function() {
        return WeatherConditionsService.query();
      },
      getAllWaterColors: function() {
        return WaterColorsService.query();
      },
      getAllWaterFlows: function() {
        return WaterFlowService.query();
      },
      getAllShorelineTypes: function() {
        return ShorelineTypesService.query();
      },
      getAllGarbageExtent: function() {
        return garbageExtent;
      },
      getAllWindDirections: function() {
        return windDirection;
      },
      getAllTrueFalse: function() {
        return trueFalse;
      },
      getWeatherCondition: function(value) {
        var index = lodash.findIndex(weatherConditions, function(c) {
          return c.value === value;
        });
        return (index > -1) ? weatherConditions[index].label : '';
      },
      getWaterColors: function(value) {
        var index = lodash.findIndex(waterColors, function(c) {
          return c.value === value;
        });
        return (index > -1) ? waterColors[index].label : '';
      },
      getWaterFlows: function(value) {
        var index = lodash.findIndex(waterFlows, function(f) {
          return f.value === value;
        });
        return (index > -1) ? waterFlows[index].label : '';
      },
      getShorelineTypes: function(value) {
        var index = lodash.findIndex(shorelineTypes, function(t) {
          return t.value === value;
        });
        return (index > -1) ? shorelineTypes[index].label : '';
      },
      getWindDirection: function(value) {
        var index = lodash.findIndex(windDirection, function(t) {
          return t.value === value;
        });
        return (index > -1) ? windDirection[index].label : '';
      },
      getGarbageExtent: function(value) {
        var index = lodash.findIndex(garbageExtent, function(e) {
          return e.value === value;
        });
        return (index > -1) ? garbageExtent[index].label : '';
      },
      getMobileOrganismById: function(organismId) {
        var index = lodash.findIndex(mobileOrganisms, function(m) {
          return organismId === m._id;
        });
        return mobileOrganisms[index];
      },
      getSessileOrganismName: function(value) {
        var index = lodash.findIndex(sessileOrganisms, function(o) {
          return o._id === value;
        });
        return (index > -1) ? sessileOrganisms[index].commonName : '';
      },
      getExpeditionDate: function(date) {
        return (date === '1970-01-01T00:00:00.000Z') ? '' :
         moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
      },
      getExpeditionTimeRange: function(startDate, endDate) {
        return (startDate === '1970-01-01T00:00:00.000Z' || endDate === '1970-01-01T00:00:00.000Z') ? '' :
        moment(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm')+'-'+
          moment(endDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm');
      },
      getDate: function(date) {
        return (date === '1970-01-01T00:00:00.000Z') ? '' : moment(date).format('MMMM D, YYYY');
      },
      getShortDate: function(date) {
        return (date === '1970-01-01T00:00:00.000Z') ? '' : moment(date).format('M/D/YY');
      },
      getTime: function(date) {
        return (date === '1970-01-01T00:00:00.000Z') ? '' : moment(date).format('h:mma');
      },
      getDateTime: function(date) {
        return (date === '1970-01-01T00:00:00.000Z') ? '' : moment(date).format('MMM D, YYYY, h:mma');
      }
    };
  }
})();
