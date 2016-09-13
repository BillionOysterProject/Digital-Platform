// Meta turbidity methods service used to communicate Meta turbidity methods REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-turbidity-methods.services')
    .factory('TurbidityMethodsService', TurbidityMethodsService);

  TurbidityMethodsService.$inject = ['$resource'];

  function TurbidityMethodsService($resource) {
    return $resource('api/turbidity-methods/:turbidityMethodId', {
      turbidityMethodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
