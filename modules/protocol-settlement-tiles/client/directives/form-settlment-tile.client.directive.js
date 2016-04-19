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
        link: function (scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.form.settlementTileForm.$setPristine();
          });

          scope.submitForm = function(settlementTile, isValid) {
            console.log('submitForm');
            if (!isValid) {
              scope.$broadcast('show-errors-check-validity', 'form.settlementTileForm');
              return false;
            }

            scope.saveFunction(settlementTile, scope.index, isValid);
          };

          scope.cancelForm = function(index) {
            scope.form.settlementTileForm.$setPristine();
            scope.cancelFunction(index);
          };
        }
      };
    });
})();
