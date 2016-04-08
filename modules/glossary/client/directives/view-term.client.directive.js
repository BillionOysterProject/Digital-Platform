(function() {
  'use strict';

  angular
    .module('glossary')
    .directive('viewTermModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/glossary/client/views/view-term.client.view.html',
        scope: {
          term: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          
        }
      };
    });
})();
