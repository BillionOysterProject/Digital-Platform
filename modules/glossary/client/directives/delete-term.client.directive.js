(function() {
  'use strict';

  angular
    .module('glossary')
    .directive('deleteTermModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/glossary/client/views/delete-term.client.view.html',
        scope: {
          term: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        controller: 'TermController',
        link: function(scope, element, attrs) {
          
        }
      };
    });
})();
