(function () {
  'use strict';

  angular
    .module('mobile-organisms.services')
    .factory('MobileOrganismsService', MobileOrganismsService);

  MobileOrganismsService.$inject = ['$resource'];

  function MobileOrganismsService($resource) {
    return $resource('api/mobile-organisms/:mobileOrganismsId', {
      mobileOrganismsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }, query: {
        method: 'GET',
        params: {
          category: '@category',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
