(function() {
  'use strict';

  angular
    .module('profiles.services')
    .factory('LeaderMemberService', LeaderMemberService);

  LeaderMemberService.$inject = ['$resource'];

  function LeaderMemberService($resource) {
    return $resource('api/users/leaders/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      remove: {
        method: 'DELETE'
      }
    });
  }
})();
