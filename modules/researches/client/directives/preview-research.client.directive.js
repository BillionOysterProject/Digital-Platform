(function() {
  'use strict';

  angular
    .module('researches')
    .directive('previewResearchModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/researches/client/views/preview-research.client.view.html',
        scope: {
          posterImage: '@',
          closeFunction: '='
        },
        controller: function($scope) {
          $scope.close = function() {
            $scope.closeFunction();
          };
        }
      };
    });
})();
