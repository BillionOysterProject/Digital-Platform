(function () {
  'use strict';

  angular
    .module('forms')
    .factory('GoogleGeoCodeService', GoogleGeoCodeService);

  GoogleGeoCodeService.$inject = ['$resource'];

  function GoogleGeoCodeService($resource) {
    return $resource('//maps.googleapis.com/maps/api/geocode/json', null, {
      query: {
        method: 'GET',
        params: {
          address: '@val',
          sensor: '@sensor'
        },
        isArray: false
      }
    });
  }
})();
