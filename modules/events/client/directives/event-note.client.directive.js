(function() {
  'use strict';

  angular
    .module('events')
    .directive('eventNoteModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/events/client/views/event-note.client.view.html',
        controller: 'EventNoteController',
        scope: {
          event: '=',
          registrant: '=',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.note = (scope.registrant) ? scope.registrant.note : '';
            scope.error = [];
          });
          scope.$watch('registrant', function(newValue, oldValue) {
            scope.registrant = newValue;
            scope.note = (scope.registrant) ? scope.registrant.note : '';
          });
        }
      };
    });
})();
