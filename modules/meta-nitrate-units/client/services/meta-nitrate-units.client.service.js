// Meta nitrate units service used to communicate Meta nitrate units REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-nitrate-units.services')
    .factory('NitrateUnitsService', NitrateUnitsService);

  NitrateUnitsService.$inject = ['$resource'];

  function NitrateUnitsService($resource) {
    return $resource('api/nitrate-units/:nitrateUnitId', {
      nitrateUnitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
