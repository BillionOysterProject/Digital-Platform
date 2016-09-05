// Meta turbidity units service used to communicate Meta turbidity units REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-turbidity-units.services')
    .factory('TurbidityUnitsService', TurbidityUnitsService);

  TurbidityUnitsService.$inject = ['$resource'];

  function TurbidityUnitsService($resource) {
    return $resource('api/turbidity-units/:turbidityUnitId', {
      turbidityUnitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
