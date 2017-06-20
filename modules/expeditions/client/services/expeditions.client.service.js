(function () {
  'use strict';

  angular
    .module('expeditions.services')
    .factory('ExpeditionsService', ExpeditionsService);

  ExpeditionsService.$inject = ['$resource'];

  function ExpeditionsService($resource) {
    return $resource('api/expeditions/:expeditionId', {
      expeditionId: '@_id',
      full: '@full'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          teamId: '@teamId',
          station: '@station',
          organization: '@organization',
          dateRange: '@dateRange',
          byOwner: '@byOwner',
          byMember: '@byMember',
          userId: '@userId',
          sort: '@sort',
          limit: '@limit',
          page: '@page'
        },
        isArray: false
      }
    });
  }

  // angular
  //   .module('expeditions.services')
  //   .factory('ExpeditionsCompareService', ExpeditionsCompareService);
  //
  // ExpeditionsCompareService.$inject = ['$resource'];
  //
  // function ExpeditionsCompareService($resource) {
  //   return $resource('api/expeditions/compare', {
  //   }, {
  //     query: {
  //       method: 'GET',
  //       params: {
  //         teamId: '@teamId',
  //         station: '@station',
  //         organization: '@organization',
  //         dateRange: '@dateRange',
  //         sort: '@sort',
  //         limit: '@limit',
  //         page: '@page',
  //         protocol1: '@protocol1',
  //         protocol2: '@protocol2',
  //         protocol3: '@protocol3',
  //         protocol4: '@protocol4',
  //         protocol5: '@protocol5'
  //       },
  //       isArray: true
  //     }
  //   });
  // }
})();
