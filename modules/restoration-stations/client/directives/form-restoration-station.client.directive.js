(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('formRestorationStationModal', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/restoration-stations/client/views/form-restoration-station.client.view.html',
        scope: {
          station: '=',
          teams: '=',
          saveFunction: '=',
          cancelFunction: '='
        },
        controller: 'RestorationStationsController',
        replace: true,
        link: function(scope, element, attrs) {

        }
      };
    });
})();
