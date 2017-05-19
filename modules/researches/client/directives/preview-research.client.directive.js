(function() {
  'use strict';

  angular
    .module('researches')
    .directive('previewResearchModal', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/researches/client/views/preview-research.client.view.html',
        scope: {
          posterImage: '=',
          closeFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.image = null;
            scope.image = scope.posterImage;
          });
        },
        controller: function($scope) {
          $scope.close = function() {
            $scope.closeFunction();
          };
        }
      };
    });
})();
