(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('formRestorationStationMarkerPopup', ['$http', '$compile','$templateCache',
      function($http, $compile, $templateCache) {
        return {
          restrict: 'E',
          scope: {
            station: '=',
            openView: '='
          },
          replace: true,
          link: function(scope, element, attrs) {
            scope.photoUrl = (scope.station.photo && scope.station.photo.path) ? scope.station.photo.path : '';
            scope.teamLead = (scope.station.teamLead) ? scope.station.teamLead.displayName : '';
            scope.schoolOrg = (scope.station.schoolOrg) ? scope.station.schoolOrg.name : '';
            var viewKey = 'modules/restoration-stations/client/views/form-restoration-station-marker-popup.client.view.html';

            $http.get(viewKey,{ cache:$templateCache }).then(function(results){
              var html = results.data;
              if (html && scope && element) {
                var template = $compile(html)(scope);
                if (template) element.append(template);
              }
            });
          }
        };
      }]);
})();
