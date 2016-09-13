(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('compareExpeditionViewComparison', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/compare-expedition-view-comparison.client.view.html',
        scope: false,
        replace: true,
      };
    });
})();
