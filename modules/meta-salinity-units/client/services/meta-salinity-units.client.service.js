// Meta salinity units service used to communicate Meta salinity units REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-salinity-units.services')
    .factory('SalinityUnitsService', SalinityUnitsService);

  SalinityUnitsService.$inject = ['$resource'];

  function SalinityUnitsService($resource) {
    return $resource('api/salinity-units/:salinityUnitId', {
      salinityUnitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
