(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('compareExpeditionSelectExpeditions', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/compare-expedition-select-expeditions.client.view.html',
        scope: false,
        replace: true,
      };
    });
})();
