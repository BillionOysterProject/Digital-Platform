(function () {
  'use strict';

  angular
    .module('teams.services')
    .factory('TeamsByUserService', TeamsByUserService);

  TeamsByUserService.$inject = ['$resource'];

  function TeamsByUserService($resource) {
    return $resource('api/teams/user', {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
})();
