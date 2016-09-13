// Meta water temperature methods service used to communicate Meta water temperature methods REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-water-temperature-methods.services')
    .factory('WaterTemperatureMethodsService', WaterTemperatureMethodsService);

  WaterTemperatureMethodsService.$inject = ['$resource'];

  function WaterTemperatureMethodsService($resource) {
    return $resource('api/water-temperature-methods/:waterTemperatureMethodId', {
      waterTemperatureMethodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
