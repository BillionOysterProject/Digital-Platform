(function () {
  'use strict';

  angular
    .module('meta-nycsss-units.services')
    .factory('NycsssUnitsService', NycsssUnitsService);

  NycsssUnitsService.$inject = ['$resource'];

  function NycsssUnitsService($resource) {
    return $resource('api/nycsss-units/:standardId', {
      standardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          select: '@select',
          searchString: '@searchString'
        },
        isArray: true
      }
    });
  }
})();
