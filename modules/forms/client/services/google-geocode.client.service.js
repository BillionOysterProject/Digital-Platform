(function () {
  'use strict';

  angular
    .module('forms')
    .factory('GoogleGeoCodeService', GoogleGeoCodeService);

  GoogleGeoCodeService.$inject = ['$resource'];

  function GoogleGeoCodeService($resource) {
    return $resource('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDzLHr0NnBoLz3Cllv1AQ5nKbWTlAy6_Cs', null, {
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
