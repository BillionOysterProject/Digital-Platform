(function() {
  'use strict';

  angular
    .module('forms')
    .directive('ngBackgroundImage', function() {
      return {
        restrict: 'AE',
        scope: {
          imageUrl: '='
        }, 
        link: function(scope, element, attrs) {
          element.css({
            'background-image': 'url(' + scope.imageUrl + ')'
          });
        }
      };
    });
})();