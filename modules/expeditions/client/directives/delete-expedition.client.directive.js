(function() {
  'use strict';

  angular
    .module('expeditions')
    .directive('deleteExpeditionModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/expeditions/client/views/delete-expedition.client.view.html',
        scope: {
          callbackFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
