(function () {
  'use strict';

  angular
    .module('meta-water-colors.services')
    .factory('WaterColorsService', WaterColorsService);

  WaterColorsService.$inject = ['$resource'];

  function WaterColorsService($resource) {
    return $resource('api/water-colors/:waterColorId', {
      waterColorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
