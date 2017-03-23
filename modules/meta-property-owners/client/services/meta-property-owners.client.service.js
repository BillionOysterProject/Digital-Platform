// Property owners service used to communicate Property owners REST endpoints
(function () {
  'use strict';

  angular
    .module('property-owners.services')
    .factory('PropertyOwnersService', PropertyOwnersService);

  PropertyOwnersService.$inject = ['$resource'];

  function PropertyOwnersService($resource) {
    return $resource('api/property-owners/:propertyOwnerId', {
      propertyOwnerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
