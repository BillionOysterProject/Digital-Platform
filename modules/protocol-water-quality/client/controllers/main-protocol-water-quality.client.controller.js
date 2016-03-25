(function () {
  'use strict';

  angular
    .module('protocol-water-quality')
    .controller('ProtocolWaterQualityMainController', ProtocolWaterQualityMainController);

  ProtocolWaterQualityMainController.$inject = ['$scope', 'ProtocolWaterQualityService'];

  function ProtocolWaterQualityMainController($scope, ProtocolWaterQualityService) {
    var vm = this;
  }
})();
