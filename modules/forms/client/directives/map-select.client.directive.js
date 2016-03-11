(function() {
  'use strict';

  angular
    .module('forms')
    .directive('mapSelect', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/forms/client/views/map-select.client.view.html',
        scope: {
          latitude: '=',
          longitude: '=',
        },
        require: ['latitude', 'longitude'],
        replace: true
      };
    });
})();
