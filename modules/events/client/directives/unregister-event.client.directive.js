(function() {
  'use strict';

  angular
    .module('events')
    .directive('unregisterEventModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/events/client/views/unregister-event.client.view.html',
        scope: {
          event: '=',
          dateTimeString: '@'
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
