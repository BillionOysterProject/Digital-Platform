(function() {
  'use strict';

  angular
    .module('restoration-stations')
    .directive('formRestorationStationMarkerPopup', ['$http', '$compile','$templateCache', function($http, $compile, $templateCache) {
      return {
        restrict: 'E',
        scope: {
          name: '=',
          bodyOfWater: '=',
          team: '='
        },
        replace: true,
        link: function(scope, element, attrs) {
          
          $http.get('modules/restoration-stations/client/views/form-restoration-station-marker-popup.client.view.html',{cache:$templateCache}).then(function(results){
            
            var html = results.data;
            var template = $compile(html)(scope);

            element.append(template);
          });
          
          
        }
      };
    }]);
})();
