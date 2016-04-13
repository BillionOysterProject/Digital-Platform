(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionProtocolsController', ExpeditionProtocolsController);

  ExpeditionProtocolsController.$inject = ['$scope', '$state', 'moment', 'lodash', 'expeditionResolve', 'Authentication'];

  function ExpeditionProtocolsController($scope, $state, moment, lodash, expedition, Authentication) {
    var vm = this;
    vm.expedition = expedition;
    vm.user = Authentication.user;

    console.log('vm.expedition', vm.expedition);

    vm.getExpeditionDate = function() {
      return moment(vm.expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
    };

    var checkRole = function(role) {
      var teamLeadIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');
  }
})();
