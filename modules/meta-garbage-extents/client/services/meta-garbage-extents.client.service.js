// Meta garbage extents service used to communicate Meta garbage extents REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-garbage-extents.services')
    .factory('GarbageExtentsService', GarbageExtentsService);

  GarbageExtentsService.$inject = ['$resource'];

  function GarbageExtentsService($resource) {
    return $resource('api/garbage-extents/:garbageExtentId', {
      garbageExtentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
