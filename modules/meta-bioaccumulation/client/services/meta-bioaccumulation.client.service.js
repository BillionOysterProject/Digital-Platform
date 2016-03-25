(function () {
  'use strict';

  angular
    .module('meta-bioaccumulation.services')
    .factory('BioaccumulationService', BioaccumulationService);

  BioaccumulationService.$inject = ['$resource'];

  function BioaccumulationService($resource) {
    return $resource('api/bioaccumulations/:bioaccumulationId', {
      bioaccumulationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
