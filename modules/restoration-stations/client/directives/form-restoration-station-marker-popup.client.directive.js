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
          teamLead: '=',
          schoolOrg: '=',
          photoUrl: '='
        },
        replace: true,
        link: function(scope, element, attrs) {

          var viewKey = 'modules/restoration-stations/client/views/form-restoration-station-marker-popup.client.view.html';

          var html = $templateCache.get(viewKey);

          if(html){
            appendHtml();
          } else{
            $http.get(viewKey,{ cache:$templateCache }).then(function(results){
              html = results.data;
              appendHtml();
            });
          }

          function appendHtml(){
            var template = $compile(html)(scope);
            element.append(template);
          }
        }
      };
    }]);
})();
