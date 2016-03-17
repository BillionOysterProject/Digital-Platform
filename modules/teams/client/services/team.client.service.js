(function () {
  'use strict';

  angular
    .module('teams.services')
    .factory('TeamsService', TeamsService);

  TeamsService.$inject = ['$resource'];

  function TeamsService($resource) {
    return {
      all: $resource('api/teams/:teamId', {
        teamId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      owner: $resource('api/team', { 
      }, {
        update: {
          method: 'PUT'
        }
      })
    };
  }
})();
