(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('formRestorationStationStatusPopup', ['$state',
      function($state) {
        return {
          restrict: 'E',
          templateUrl: 'modules/restoration-stations/client/views/form-restoration-station-status-popup.client.view.html',
          scope: {
            station: '=',
            closeFunction: '='
          },
          replace: true,
          link: function(scope, element, attrs) {
            element.bind('show.bs.modal', function() {
              scope.$broadcast('stationStatus');
            });
          }
        };
      }]);
})();
