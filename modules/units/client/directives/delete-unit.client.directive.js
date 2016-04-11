(function() {
  'use strict';

  angular
    .module('units')
    .directive('deleteUnitModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/units/client/views/delete-unit.client.view.html',
        scope: {
          callbackFunction: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();