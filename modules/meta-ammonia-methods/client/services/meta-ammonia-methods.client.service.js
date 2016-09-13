// Meta ammonia methods service used to communicate Meta ammonia methods REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-ammonia-methods.services')
    .factory('AmmoniaMethodsService', AmmoniaMethodsService);

  AmmoniaMethodsService.$inject = ['$resource'];

  function AmmoniaMethodsService($resource) {
    return $resource('api/ammonia-methods/:ammoniaMethodId', {
      ammoniaMethodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
