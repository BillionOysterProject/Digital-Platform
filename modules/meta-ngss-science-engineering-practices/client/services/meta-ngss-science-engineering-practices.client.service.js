(function () {
  'use strict';

  angular
    .module('meta-ngss-science-engineering-practices.services')
    .factory('NgssScienceEngineeringPracticesService', NgssScienceEngineeringPracticesService);

  NgssScienceEngineeringPracticesService.$inject = ['$resource'];

  function NgssScienceEngineeringPracticesService($resource) {
    return $resource('api/ngss-science-engineering-practices/:standardId', {
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
