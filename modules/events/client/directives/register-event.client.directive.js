(function() {
  'use strict';

  angular
    .module('events')
    .directive('registerEventModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/events/client/views/register-event.client.view.html',
        scope: {
          canRegister: '=',
          event: '=',
          dateString: '@',
          supportFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
