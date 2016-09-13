// Meta ph methods service used to communicate Meta ph methods REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-ph-methods.services')
    .factory('PhMethodsService', PhMethodsService);

  PhMethodsService.$inject = ['$resource'];

  function PhMethodsService($resource) {
    return $resource('api/ph-methods/:phMethodId', {
      phMethodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
