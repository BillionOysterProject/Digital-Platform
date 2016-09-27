(function() {
  'use strict';

  angular
    .module('events')
    .directive('deleteEventModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/events/client/views/delete-event.client.view.html',
        scope: {
          callbackFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
