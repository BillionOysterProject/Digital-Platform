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
          $scope.selected = null;

          $scope.save = function() {
            $http.post('/api/units/' + $scope.unit._id + '/sub-units', {
              subUnits: $scope.subUnits
            })
            .success(function(data, status, headers, config) {
              $scope.error = null;
              $scope.closeFunction(true);
            })
            .error(function(data, status, headers, config) {
              $scope.error = data.message;
            });
          };

          $scope.close = function() {
            $scope.closeFunction();
          };
        },
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function() {
            scope.subUnits = angular.copy(scope.unit.subUnits);
          });
        }
      };
    });
})();
