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
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
