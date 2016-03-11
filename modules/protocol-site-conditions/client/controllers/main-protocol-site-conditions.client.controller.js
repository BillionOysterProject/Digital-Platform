(function () {
  'use strict';

  angular
    .module('protocol-site-conditions')
    .controller('ProtocolSiteConditionsMainController', ProtocolSiteConditionsMainController);

  ProtocolSiteConditionsMainController.$inject = ['$scope', 'ProtocolSiteConditionsService'];

  function ProtocolSiteConditionsMainController($scope, ProtocolSiteConditionsService) {
    var vm = this;
  }
})();
