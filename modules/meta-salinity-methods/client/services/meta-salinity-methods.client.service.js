// Meta salinity methods service used to communicate Meta salinity methods REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-salinity-methods.services')
    .factory('SalinityMethodsService', SalinityMethodsService);

  SalinityMethodsService.$inject = ['$resource'];

  function SalinityMethodsService($resource) {
    return $resource('api/salinity-methods/:salinityMethodId', {
      salinityMethodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
