(function () {
  'use strict';

  angular
    .module('school-orgs.services')
    .factory('SchoolOrganizationsService', SchoolOrganizationsService);

  SchoolOrganizationsService.$inject = ['$resource'];

  function SchoolOrganizationsService($resource) {
    return $resource('api/school-orgs/:schoolOrgId', {
      schoolOrgId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
