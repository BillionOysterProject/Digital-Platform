(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionProtocolsController', ExpeditionProtocolsController);

  ExpeditionProtocolsController.$inject = ['$scope', '$state', 'moment', 'lodash', 'expeditionResolve', 'Authentication'];

  function ExpeditionProtocolsController($scope, $state, moment, lodash, expedition, Authentication) {
    var vm = this;
    vm.expedition = expedition;
  }
})();
