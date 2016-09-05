(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('compareExpeditionSelectData', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/compare-expedition-select-data.client.view.html',
        scope: false,
        replace: true,
      };
    });
})();
