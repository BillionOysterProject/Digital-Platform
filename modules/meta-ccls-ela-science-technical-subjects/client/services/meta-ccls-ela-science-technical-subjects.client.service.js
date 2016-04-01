(function () {
  'use strict';

  angular
    .module('meta-ccls-ela-science-technical-subjects.services')
    .factory('CclsElaScienceTechnicalSubjectsService', CclsElaScienceTechnicalSubjectsService);

  CclsElaScienceTechnicalSubjectsService.$inject = ['$resource'];

  function CclsElaScienceTechnicalSubjectsService($resource) {
    return $resource('api/ccls-ela-science-technical-subjects/:standardId', {
      standardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
