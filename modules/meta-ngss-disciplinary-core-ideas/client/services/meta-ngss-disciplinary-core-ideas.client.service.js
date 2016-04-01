(function () {
  'use strict';

  angular
    .module('meta-ngss-disciplinary-core-ideas.services')
    .factory('NgssDisciplinaryCoreIdeasService', NgssDisciplinaryCoreIdeasService);

  NgssDisciplinaryCoreIdeasService.$inject = ['$resource'];

  function NgssDisciplinaryCoreIdeasService($resource) {
    return $resource('api/ngss-disciplinary-core-ideas/:standardId', {
      standardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
