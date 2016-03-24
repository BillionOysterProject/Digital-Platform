(function () {
  'use strict';

  angular
    .module('protocol-mobile-traps')
    .controller('ProtocolMobileTrapsMainController', ProtocolMobileTrapsMainController);

  ProtocolMobileTrapsMainController.$inject = ['$scope', 'ProtocolMobileTrapsService'];

  function ProtocolMobileTrapsMainController($scope, ProtocolMobileTrapsService) {
    var mt = this;
  }
})();
