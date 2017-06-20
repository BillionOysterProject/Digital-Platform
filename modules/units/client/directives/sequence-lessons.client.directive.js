(function() {
  'use strict';

  angular
    .module('units')
    .directive('sequenceLessonsModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/units/client/views/sequence-lessons.client.view.html',
        scope: {
          unit: '=',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, $http) {
          $scope.selected = null;

          $scope.onDrop = function(item) {
            console.log('drop', item);
          };

          $scope.move = function(index){
            console.log('move', index);
            $scope.unit.lessons.splice(index, 1);
          };

          $scope.save = function() {
            $scope.closeFunction(true);
          };

          $scope.close = function() {
            $scope.closeFunction();
          };
        },
        link: function(scope, element, attrs) {

        }
      };
    });
})();
