(function () {
  'use strict';

  angular
    .module('protocol-site-conditions.services')
    .factory('ProtocolSiteConditionsService', ProtocolSiteConditionsService);

  ProtocolSiteConditionsService.$inject = ['$resource'];

  function ProtocolSiteConditionsService($resource) {
    return $resource('api/protocol-site-conditions/:siteConditionId', {
      siteConditionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
