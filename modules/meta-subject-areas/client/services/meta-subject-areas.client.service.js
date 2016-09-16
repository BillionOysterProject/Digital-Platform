(function () {
  'use strict';

  angular
    .module('meta-subject-areas.services')
    .factory('SubjectAreasService', SubjectAreasService);

  SubjectAreasService.$inject = ['$resource'];

  function SubjectAreasService($resource) {
    return $resource('api/subject-areas/:subjectAreaId', {
      subjectAreaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          searchString: '@searchString'
        },
        isArray: true
      }
    });
  }
})();
