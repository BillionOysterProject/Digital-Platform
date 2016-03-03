(function () {
  'use strict';

  angular
    .module('sites.services')
    .factory('SitesService', SitesService);

  SitesService.$inject = ['$resource'];

  function SitesService($resource) {
    return $resource('api/sites/:siteId', {
      siteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
