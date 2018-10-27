(function () {
  'use strict';

  angular
    .module('sites.services')
    .factory('SitesService', SitesService);

  SitesService.$inject = ['$resource'];

  function SitesService($resource) {
    return $resource('api/sites/:site', {
      site: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
