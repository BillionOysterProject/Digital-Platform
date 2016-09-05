// Meta ammonia units service used to communicate Meta ammonia units REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-ammonia-units.services')
    .factory('AmmoniaUnitsService', AmmoniaUnitsService);

  AmmoniaUnitsService.$inject = ['$resource'];

  function AmmoniaUnitsService($resource) {
    return $resource('api/ammonia-units/:ammoniaUnitId', {
      ammoniaUnitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
