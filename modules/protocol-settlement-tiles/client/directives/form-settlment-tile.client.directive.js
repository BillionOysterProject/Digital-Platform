(function() {
  'use strict';

  angular
    .module('protocol-settlement-tiles')
    .directive('formSettlementTile', function($http) {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-settlement-tiles/client/views/form-settlement-tile.client.view.html',
        scope: {
          grids: '=',
          sessileOrganisms: '=',
          saveFunction: '=',
          cancelFunction: '=',
          index: '@'
        },
        replace: true,
        controller: function($scope, $http) {
          $scope.save = function(isValid) {
            if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'form.tileForm');
              return false;
            }

            $scope.saveFunction($scope.grids, $scope.index, isValid);
          };

          $scope.cancelForm = function(index) {
            $scope.$broadcast('show-errors-reset', 'form.tileForm');
            $scope.form.tileForm.$setSubmitted(false);
            // $scope.form.tileForm.$setPristine(true);
            // $scope.form.tileForm.$valid = true;
            // $scope.form.tileForm.$invalid = false;
            $scope.cancelFunction(index);
          };
        },
        link: function (scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            // console.log('open');
            scope.$broadcast('show-errors-reset', 'form.tileForm');
            scope.form.tileForm.$setSubmitted(false);
            scope.form.tileForm.$setPristine(true);
            // scope.form.tileForm.$valid = true;
            // scope.form.tileForm.$invalid = false;
          });
        }
      };
    });
})();
