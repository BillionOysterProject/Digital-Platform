(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$http', 'Authentication', 'ExpeditionViewHelper', 'TeamsService'];

  function ProfileController($scope, $http, Authentication, ExpeditionViewHelper, TeamsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.error = [];

    vm.checkRole = ExpeditionViewHelper.checkRole;
    vm.isTeamLead = vm.checkRole('team lead') || vm.checkRole('team lead pending');

    vm.findTeams = function() {
      TeamsService.query({
        byOwner: true
      }, function(data) {
        vm.teams = data;
      });
    };
    vm.findTeams();

    vm.openTeamFormModal = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamFormModal = function() {
      angular.element('#modal-team-edit').modal('hide');
    };
  }
})();
