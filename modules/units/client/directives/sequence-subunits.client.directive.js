(function() {
  'use strict';

  angular
    .module('units')
    .directive('sequenceSubUnitModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/units/client/views/sequence-subunits.client.view.html',
        scope: {
          unit: '=',
          closeFunction: '='
        },
        replace: true,
        controller: function($scope, $http) {
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
