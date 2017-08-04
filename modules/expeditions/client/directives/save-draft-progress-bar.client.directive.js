(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('saveDraftProgressBar', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/save-draft-progress-bar.client.view.html',
        scope: {
          value: '=',
          status: '=',
          showClose: '=?'
        }
      };
    });
})();
