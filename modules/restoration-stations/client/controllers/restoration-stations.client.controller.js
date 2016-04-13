(function () {
  'use strict';

  angular
    .module('restoration-stations')
    .controller('RestorationStationsController', RestorationStationsController);

  RestorationStationsController.$inject = ['$scope', 'lodash', 'moment', 'Authentication',
  'TeamsService', 'TeamMembersService', 'RestorationStationsService', 'ExpeditionsService'];

  function RestorationStationsController($scope, lodash, moment, Authentication,
    TeamsService, TeamMembersService, RestorationStationsService, ExpeditionsService) {
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
      TeamMembersService.query({
        byOwner: true,
        teamId: vm.filter.teamId
      }, function(data) {
        vm.members = data;
      });

      RestorationStationsService.query({
        teamId: vm.filter.teamId
      }, function(data) {
        vm.stations = data;
      });

      var byMember = (vm.isTeamLead) ? '' : true;
      ExpeditionsService.query({
        teamId: vm.filter.teamId,
        byMember: byMember,
        limit: 5
      }, function(data) {
        vm.expeditions = data;
      });
    };

    vm.findTeams();

    vm.initializeBasedOnTeam = function() {
      if (!vm.filter.teamId || vm.filter.teamId === '') {
        vm.filter.teamId = (vm.teams.length > 0) ? vm.teams[0]._id : '';
        vm.team = vm.teams[0];
        console.log('teamId', vm.filter.teamId);
        vm.findTeamValues();
      }
    };

    vm.fieldChanged = function(team) {
      vm.filter.teamId = (team) ? team._id : '';
      vm.team = team;
      vm.findTeamValues();
    };

    vm.isUpcoming = function(expedition) {
      return (moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isAfter(moment())) ? true : false;
    };

    vm.getExpeditionDate = function(expedition) {
      return moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY');
    };

    vm.getExpeditionTimeRange = function(expedition) {
      return moment(expedition.monitoringStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm')+'-'+
        moment(expedition.monitoringEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm');
    };
  }
})();
