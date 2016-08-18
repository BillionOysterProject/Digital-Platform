(function() {
  'use strict';

  angular
    .module('protocol-mobile-traps')
    .directive('viewProtocolMobileTrap', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-mobile-traps/client/views/view-protocol-mobile-trap.client.view.html',
        controller: 'ProtocolMobileTrapsController',
        scope: false
      };
    });
})();
