(function () {
  'use strict';

  angular
    .module('curriculum.services')
    .factory('UnitLessonsService', UnitLessonsService);

  UnitLessonsService.$inject = ['$resource'];

  function UnitLessonsService($resource) {
    return $resource('api/units/:unitId/lessons', {
      unitId: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
})();
