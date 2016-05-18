(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('removeProtocolTabModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/remove-protocol-tab.client.view.html',
        scope: {
          changes: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
