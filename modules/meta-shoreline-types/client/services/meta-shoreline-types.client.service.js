(function () {
  'use strict';

  angular
    .module('meta-shoreline-types.services')
    .factory('ShorelineTypesService', ShorelineTypesService);

  ShorelineTypesService.$inject = ['$resource'];

  function ShorelineTypesService($resource) {
    return $resource('api/shoreline-types/:shorelineTypeId', {
      shorelineTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
