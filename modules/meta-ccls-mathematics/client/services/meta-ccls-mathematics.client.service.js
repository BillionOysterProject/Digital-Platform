(function () {
  'use strict';

  angular
    .module('meta-ccls-mathematics.services')
    .factory('CclsMathematicsService', CclsMathematicsService);

  CclsMathematicsService.$inject = ['$resource'];

  function CclsMathematicsService($resource) {
    return $resource('api/ccls-mathematics/:standardId', {
      standardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        params: {
          select: '@select',
          searchString: '@searchString'
        },
        isArray: true
      }
    });
  }
})();
