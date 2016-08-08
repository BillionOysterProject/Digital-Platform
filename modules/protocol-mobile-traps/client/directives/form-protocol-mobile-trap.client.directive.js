(function() {
  'use strict';

  angular
    .module('protocol-mobile-traps')
    .directive('formProtocolMobileTrap', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-mobile-traps/client/views/form-protocol-mobile-trap.client.view.html',
        controller: 'ProtocolMobileTrapsController',
        scope: false
      };
    });
})();
