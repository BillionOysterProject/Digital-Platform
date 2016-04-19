(function () {
  'use strict';

  angular
    .module('expedition-activities.services')
    .factory('ExpeditionActivitiesService', ExpeditionActivitiesService);

  ExpeditionActivitiesService.$inject = ['$resource'];

  function ExpeditionActivitiesService($resource) {
    return $resource('api/expedition-activities/:expeditionActivityId', {
      expeditionActivityId: '@_id'
    }, {
      query: {
        method: 'GET',
        params: {
          teamId: '@teamId',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: true
      }
    });
  }
})();
