(function() {
  'use strict';

  angular
    .module('glossary')
    .directive('formTermModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/glossary/client/views/form-term.client.view.html',
        scope: {
          term: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        replace: true,
        transclude: true,
        controller: 'TermController',
        link: function(scope, element, attrs) {

        }
      };
    });
})();
