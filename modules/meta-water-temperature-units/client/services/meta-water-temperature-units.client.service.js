// Meta water temperature units service used to communicate Meta water temperature units REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-water-temperature-units.services')
    .factory('WaterTemperatureUnitsService', WaterTemperatureUnitsService);

  WaterTemperatureUnitsService.$inject = ['$resource'];

  function WaterTemperatureUnitsService($resource) {
    return $resource('api/water-temperature-units/:waterTemperatureUnitId', {
      waterTemperatureUnitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
