(function () {
  'use strict';

  angular
    .module('units.services')
    .factory('UnitsService', UnitsService);

  UnitsService.$inject = ['$resource'];

  function UnitsService($resource) {
    return $resource('api/units/:unitId', {
      unitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
