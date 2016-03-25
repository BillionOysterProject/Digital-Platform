(function () {
  'use strict';

  angular
    .module('meta-organism-categories.services')
    .factory('OrganismCategoriesService', OrganismCategoriesService);

  OrganismCategoriesService.$inject = ['$resource'];

  function OrganismCategoriesService($resource) {
    return $resource('api/organism-categories/:organismCategoryId', {
      organismCategoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
