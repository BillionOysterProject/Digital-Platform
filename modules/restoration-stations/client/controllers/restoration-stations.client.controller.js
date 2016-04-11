(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsController', RestorationStationsController);

  RestorationStationsController.$inject = ['$scope', 'lodash', 'Authentication', 'TeamsByUserService'];

  function RestorationStationsController($scope, lodash, Authentication, TeamsByUserService) {
    var vm = this;
    vm.user = Authentication.user;

    var checkRole = function(role) {
      var teamLeadIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');

    vm.teams = (vm.isTeamMember) ? TeamsByUserService.query() : null;
    vm.schoolOrg = TeamByUserService.get();

  }
})();
