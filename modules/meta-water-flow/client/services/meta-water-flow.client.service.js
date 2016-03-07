(function () {
  'use strict';

  angular
    .module('meta-water-flow.services')
    .factory('WaterFlowService', WaterFlowService);

  WaterFlowService.$inject = ['$resource'];

  function WaterFlowService($resource) {
    return $resource('api/water-flows/:waterFlowId', {
      waterFlowId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
