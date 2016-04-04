(function() {
  'use strict';

  angular
    .module('forms')
    .directive('decimalPointInput', function() {
      return {
        restrict: 'A',
        scope: {
          points: '@'
        },
        link: function(scope, element, attrs) {
          scope.$watch(attrs.ngModel, function (v) {
            if (v.match(/\d+(\.\d{0,2})?/)) {

            }
          });
        }
      };
    });
})();
