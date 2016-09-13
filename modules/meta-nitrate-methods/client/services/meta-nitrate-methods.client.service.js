// Meta nitrates methods service used to communicate Meta nitrates methods REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-nitrate-methods.services')
    .factory('NitrateMethodsService', NitrateMethodsService);

  NitrateMethodsService.$inject = ['$resource'];

  function NitrateMethodsService($resource) {
    return $resource('api/nitrate-methods/:nitrateMethodId', {
      nitrateMethodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
