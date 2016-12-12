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
          mapPoints: '=',
          saveFunction: '=',
          removeFunction: '=',
          cancelFunction: '='
        },
        controller: 'RestorationStationsController',
        replace: true,
        link: function(scope, element, attrs) {
          element.bind('show.bs.modal', function () {
            scope.form.restorationStationForm.$setSubmitted(false);
            scope.form.restorationStationForm.$setPristine();
          });
        }
      };
    });
})();
