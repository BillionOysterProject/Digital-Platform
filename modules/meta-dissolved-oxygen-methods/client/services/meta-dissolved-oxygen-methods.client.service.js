// Meta dissolved oxygen methods service used to communicate Meta dissolved oxygen methods REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-dissolved-oxygen-methods.services')
    .factory('DissolvedOxygenMethodsService', DissolvedOxygenMethodsService);

  DissolvedOxygenMethodsService.$inject = ['$resource'];

  function DissolvedOxygenMethodsService($resource) {
    return $resource('api/dissolved-oxygen-methods/:dissolvedOxygenMethodId', {
      dissolvedOxygenMethodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
