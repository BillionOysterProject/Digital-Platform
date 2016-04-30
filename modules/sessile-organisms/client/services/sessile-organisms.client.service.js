(function () {
  'use strict';

  angular
    .module('sessile-organisms.services')
    .factory('SessileOrganismsService', SessileOrganismsService);

  SessileOrganismsService.$inject = ['$resource'];

  function SessileOrganismsService($resource) {
    return $resource('api/sessile-organisms/:sessileOrganismsId', {
      sessileOrganismsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }, query: {
        method: 'GET',
        params: {
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
