(function () {
  'use strict';

  angular
    .module('school-orgs.services')
    .factory('SchooleOrganizationsService', SchooleOrganizationsService);

  SchooleOrganizationsService.$inject = ['$resource'];

  function SchooleOrganizationsService($resource) {
    return $resource('api/school-orgs/:schoolOrgId', {
      schoolOrgId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
