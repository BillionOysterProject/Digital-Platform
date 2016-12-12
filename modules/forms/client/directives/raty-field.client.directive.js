(function() {
  'use strict';

  angular
    .module('forms')
    .directive('ratyFa', function() {
      return {
        restrict: 'AE',
        scope: {
          score: '='
        },
        link: function(scope, elem, attrs) {
          var number = (attrs.number) ? scope.number : 5;
          var readOnly = (attrs.readOnly) ? true : false;

          scope.$watch('score',function(newValue,oldValue) {
            $(elem).raty({
              score: newValue,
              number: number,
              readOnly: readOnly,
              space: false,
              halfShow: true,
              hints: ['Very ineffective', 'Somewhat ineffective', 'Neutral', 'Somewhat effective', 'Very effective'],
              click: function(score, evt) {
                scope.score = score;
              }
            });
          });
        }
      };
    });
})();
