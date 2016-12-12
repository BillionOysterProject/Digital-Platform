(function() {
  'use strict';

  angular
    .module('events')
    .directive('emailRegistrantsModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/events/client/views/email-registrants.client.view.html',
        controller: 'EmailRegistrantsController',
        scope: {
          event: '=',
          dateTimeString: '@',
          attendees: '=',
          past: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.attendeesOnly = 'false';
            scope.subject = '';
            scope.message = '';
            scope.footer = false;
            scope.sent = false;
          });
        }
      };
    });
})();
