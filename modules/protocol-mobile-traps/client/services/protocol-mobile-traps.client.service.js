(function () {
  'use strict';

  angular
    .module('protocol-mobile-traps.services')
    .factory('ProtocolMobileTrapsService', ProtocolMobileTrapsService);

  ProtocolMobileTrapsService.$inject = ['$resource'];

  function ProtocolMobileTrapsService($resource) {
    return $resource('api/protocol-mobile-traps/:mobileTrapId', {
      mobileTrapId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
