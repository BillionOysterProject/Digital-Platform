(function () {
  'use strict';

  angular
    .module('expeditions.services')
    .factory('ExpeditionsService', ExpeditionsService);

  ExpeditionsService.$inject = ['$resource'];

  function ExpeditionsService($resource) {
    return $resource('api/expeditions/:expeditionId', {
      expeditionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
