// Meta wind directions service used to communicate Meta wind directions REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-wind-directions.services')
    .factory('WindDirectionsService', WindDirectionsService);

  WindDirectionsService.$inject = ['$resource'];

  function WindDirectionsService($resource) {
    return $resource('api/wind-directions/:windDirectionId', {
      windDirectionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
