(function () {
  'use strict';

  angular
    .module('meta-water-flow.services')
    .factory('WaterFlowService', WaterFlowService);

  WaterFlowService.$inject = ['$resource'];

  function WaterFlowService($resource) {
    return $resource('api/water-flow/:waterFlowId', {
      waterFlowId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
