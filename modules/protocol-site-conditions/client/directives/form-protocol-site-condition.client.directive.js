(function() {
  'use strict';

  angular
    .module('protocol-site-conditions')
    .directive('formProtocolSiteCondition', function() {
      return {
        restrict: 'AE',
        templateUrl: 'modules/protocol-site-conditions/client/views/form-protocol-site-condition.client.view.html',
        controller: 'ProtocolSiteConditionsController',
        scope: false
      };
    });
})();
