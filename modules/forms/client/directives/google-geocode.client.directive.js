(function() {
  'use strict';

  angular
    .module('forms')
    .directive('googleGeocode', [function() {
      
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/google-geocode.client.view.html',
        scope: {
          placeSelected:'&'
        },
        
        controller: 'GoogleGeocodeController',
        controllerAs: 'vm',
        bindToController: true,
        replace: true
      };
    }]);
})();
