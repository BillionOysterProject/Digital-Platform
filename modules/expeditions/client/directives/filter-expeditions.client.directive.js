(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('filterExpeditions', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/filter-expeditions.client.view.html',
        scope: false,
        replace: true,
      };
    });
})();
