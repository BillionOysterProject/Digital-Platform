(function() {
  'use strict';

  angular
    .module('protocol-site-conditions')
    .directive('viewProtocolSiteCondition', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-site-conditions/client/views/view-protocol-site-condition.client.view.html',
        controller: 'ProtocolSiteConditionsController',
        scope: false
      };
    });
})();
