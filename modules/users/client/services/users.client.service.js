'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('TeamLeads', ['$resource',
  function ($resource) {
    return $resource('api/users/teamleads', {}, {
      query: {
        method: 'GET',
        params: {
          role: '@role',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          role: '@role',
          teamLeadType: '@teamLeadType',
          organizationId: '@organizationId',
          searchString: '@searchString',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: false
      }
    });
  }
]);
