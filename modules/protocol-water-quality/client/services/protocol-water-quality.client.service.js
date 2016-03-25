(function () {
  'use strict';

  angular
    .module('protocol-water-quality.services')
    .factory('ProtocolWaterQualityService', ProtocolWaterQualityService);

  ProtocolWaterQualityService.$inject = ['$resource'];

  function ProtocolWaterQualityService($resource) {
    return $resource('api/protocol-water-quality/:waterQualityId', {
      waterQualityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
