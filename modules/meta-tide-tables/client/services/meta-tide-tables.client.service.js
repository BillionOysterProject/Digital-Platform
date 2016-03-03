(function () {
  'use strict';

  angular
    .module('meta-tide-tables.services')
    .factory('TideTablesService', TideTablesService);

  TideTablesService.$inject = ['$resource'];

  function TideTablesService($resource) {
    return $resource('api/tide-tables', null, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  }
})();
