// Meta dissolved oxygen units service used to communicate Meta dissolved oxygen units REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-dissolved-oxygen-units.services')
    .factory('DissolvedOxygenUnitsService', DissolvedOxygenUnitsService);

  DissolvedOxygenUnitsService.$inject = ['$resource'];

  function DissolvedOxygenUnitsService($resource) {
    return $resource('api/dissolved-oxygen-units/:dissolvedOxygenUnitId', {
      dissolvedOxygenUnitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
