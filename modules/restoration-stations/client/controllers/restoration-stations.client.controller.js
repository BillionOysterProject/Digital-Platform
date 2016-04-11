(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsController', RestorationStationsController);

  RestorationStationsController.$inject = ['$scope', 'lodash', 'Authentication',
  'TeamsService', 'TeamMembersService'];

  function RestorationStationsController($scope, lodash, Authentication,
    TeamsService, TeamMembersService) {
    var vm = this;
    vm.user = Authentication.user;

    vm.filter = {
      teamId: ''
    };

    var checkRole = function(role) {
      var teamLeadIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    vm.isTeamLead = checkRole('team lead');
    vm.isTeamMember = checkRole('team member');

    vm.findTeams = function() {
      var byOwner, byMember;
      if (vm.isTeamLead) {
        byOwner = true;
      } else {
        byMember = true;
      }
      TeamsService.query({
        byOwner: byOwner,
        byMember: byMember
      }, function(data) {
        vm.teams = data;
        vm.initializeBasedOnTeam();
      });
    };

    vm.findTeamValues = function() {
      if (vm.filter.teamId && vm.filter.teamId !== '') {
        var index = lodash.findIndex(vm.teams, function(t) {
          return t._id === vm.filter.teamId;
        });
        if (index > -1) {
          vm.team = vm.teams[index];
        }
      }

      TeamMembersService.query({
        byOwner: true,
        teamId: vm.filter.teamId
      }, function(data) {
        vm.members = data;
      });
    };

    vm.findTeams();

    vm.initializeBasedOnTeam = function() {
      if (!vm.filter.teamId || vm.filter.teamId === '') {
        vm.filter.teamId = (vm.teams.length > 0) ? vm.teams[0]._id : '';
        console.log('teamId', vm.filter.teamId);
        vm.findTeamValues();
      }
    };

    vm.fieldChanged = function($event) {
      vm.findTeamValues();
    };

  }
})();
