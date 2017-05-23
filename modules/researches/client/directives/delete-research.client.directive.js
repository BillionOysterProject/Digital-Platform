(function() {
  'use strict';

  angular
    .module('researches')
    .directive('deleteResearchModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/researches/client/views/delete-research.client.view.html',
        scope: {
          closeFunction: '='
        },
        replace: {
          link: function(scope, element, attrs) {

          }
        }
      };
    });
})();
