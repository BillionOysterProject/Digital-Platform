(function () {
  'use strict';

  angular
    .module('curriculum.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('curriculum', {
        url: '/curriculum',
        template: '<ui-view/>'
      });
  }
})();