'use strict';

angular.module('core')
  .directive('disableLink', function() {
    return {
      restrict: 'A',
      scope: {
        disabled: '=disableLink'
      },
      link: function(scope, element, attrs) {
        element.bind('click', function(event) {
          if(scope.disabled) {
            event.preventDefault();
          }
        });
      }
    };
  });
