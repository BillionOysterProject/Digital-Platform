(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamsOwnerController', TeamsOwnerController);

  TeamsOwnerController.$inject = ['$scope', '$state', 'Authentication', 'TeamsService', 'TeamMembersService', 'TeamMembersDeleteService'];

  function TeamsOwnerController($scope, $state, Authentication, TeamsService, TeamMembersService, TeamMembersDeleteService) {
    var vm = this;

    vm.filter = {
      byOwner: true,
      teamId: '',
      searchString: '',
      page: 1,
      limit: 8
    };

    vm.fieldChanged = function($event) {
      vm.findTeamMembers();
    };

    vm.searchChange = function($event){
      console.log('search changed');
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.filter.page = 1;
        vm.findTeamMembers();
      }
    };

    vm.pageChanged = function() {
      vm.findTeamMembers();
    };

    vm.findTeamMembers = function() {
      TeamMembersService.query({
        byOwner: true,
        teamId: vm.filter.teamId,
        searchString: vm.filter.searchString,
        page: vm.filter.page,
        limit: vm.filter.limit
      }, function(data) {
        vm.members = data;
      });
    };

    vm.findTeams = function() {
      TeamsService.query({
        byOwner: true
      }, function(data) {
        vm.teams = data;
      });
    };

    vm.findTeams();
    vm.findTeamMembers();

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    vm.openFormTeamMember = function(teamMember) {
      vm.teamMember = (teamMember) ? new TeamMembersService(teamMember) : new TeamMembersService();
      vm.teamMember.oldTeamId = (teamMember) ? angular.copy(teamMember.team._id) : '';
      console.log('teamMember', vm.teamMember);
      angular.element('#modal-team-member-editadd').modal('show');
    };

    vm.saveFormTeamMember = function() {
      if (vm.teamMember._id) {
        console.log('updating team');
        vm.teamMember.$update(successCallback, errorCallback);
      } else {
        vm.teamMember.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.findTeamMembers();
        vm.findTeams(); 
      }

      function errorCallback(res) {
        console.log('error: ' + res.data.message);
        vm.error = res.data.message;
      }

      angular.element('#modal-team-member-editadd').modal('hide');
    };

    vm.cancelFormTeamMember = function() {
      vm.teamMember = {};
      angular.element('#modal-team-member-editadd').modal('hide');
    };

    vm.openImportTeamMembers = function() {
      angular.element('#modal-import-team-members').modal('show');
    };

    vm.saveImportTeamMembers = function() {
      angular.element('#modal-import-team-members').modal('hide');
    };

    vm.cancelImportTeamMembers = function() {
      angular.element('#modal-import-team-members').modal('hide');
    };

    vm.openDeleteTeamMember = function(teamMember) {
      vm.teamMemberToDelete = (teamMember) ? new TeamMembersDeleteService(teamMember) : new TeamMembersDeleteService();
      angular.element('#modal-team-member-delete').modal('show');
    };

    vm.deleteTeamMember = function(teamMember) {
      vm.teamMemberToDelete.$remove(function() {
        vm.findTeamMembers();
        vm.findTeams(); 
      });
      vm.teamMemberToDelete = {};
      angular.element('#modal-team-member-delete').modal('hide');
    };

    vm.cancelDeleteTeamMember = function() {
      vm.teamMemberToDelete = {};
      angular.element('#modal-team-member-delete').modal('hide');
    };

    vm.openDeleteTeam = function(teamId) {
      TeamsService.get({
        teamId: teamId
      }, function(data) {
        vm.teamToDelete = data;
        angular.element('#modal-team-delete').modal('show');  
      });
    };

    vm.deleteTeam = function(team) {
      vm.teamToDelete.$remove(function() {
        vm.findTeamMembers();
        vm.findTeams(); 
        vm.team = {};
        angular.element('#modal-team-delete').modal('hide');
      });
    };

    vm.cancelDeleteTeam = function() {
      vm.teamToDelete = {};
      angular.element('#modal-team-delete').modal('hide');
    };

    vm.openApproveTeamMembers = function() {
      angular.element('#modal-team-member-requests').modal('show');
    };

    vm.acceptTeamMember = function() {

    };

    vm.rejectTeamMember = function() {

    };

    vm.closeApproveTeamMembers = function() {
      angular.element('#modal-team-member-requests').modal('hide');
    };
  }
})();