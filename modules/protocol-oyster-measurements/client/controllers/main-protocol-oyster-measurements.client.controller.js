(function () {
  'use strict';

  angular
    .module('protocol-oyster-measurements')
    .controller('ProtocolOysterMeasurementsMainController', ProtocolOysterMeasurementsMainController);

  ProtocolOysterMeasurementsMainController.$inject = ['$scope', 'ProtocolOysterMeasurementsService'];

  function ProtocolOysterMeasurementsMainController($scope, ProtocolOysterMeasurementsService) {
    var om = this;
  }
})();
