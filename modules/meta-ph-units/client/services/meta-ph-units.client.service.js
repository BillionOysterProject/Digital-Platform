// Meta ph units service used to communicate Meta ph units REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-ph-units.services')
    .factory('PhUnitsService', PhUnitsService);

  PhUnitsService.$inject = ['$resource'];

  function PhUnitsService($resource) {
    return $resource('api/ph-units/:phUnitId', {
      phUnitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
