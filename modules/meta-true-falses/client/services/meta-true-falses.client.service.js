// Meta true falses service used to communicate Meta true falses REST endpoints
(function () {
  'use strict';

  angular
    .module('meta-true-falses.services')
    .factory('TrueFalsesService', TrueFalsesService);

  TrueFalsesService.$inject = ['$resource'];

  function TrueFalsesService($resource) {
    return $resource('api/true-falses/:trueFalseId', {
      trueFalseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
