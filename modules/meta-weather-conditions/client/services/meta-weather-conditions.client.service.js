(function () {
  'use strict';

  angular
    .module('meta-weather-conditions.services')
    .factory('WeatherConditionsService', WeatherConditionsService);

  WeatherConditionsService.$inject = ['$resource'];

  function WeatherConditionsService($resource) {
    return $resource('api/weather-conditions/:weatherConditionId', {
      weatherConditionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
