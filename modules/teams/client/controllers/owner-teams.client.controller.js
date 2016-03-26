(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamsOwnerController', TeamsOwnerController);

  TeamsOwnerController.$inject = ['$scope', '$state', 'Authentication', 'TeamsService', 'TeamMembersService'];

  function TeamsOwnerController($scope, $state, Authentication, TeamsService, TeamMembersService) {
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

    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.team.$remove($state.go('settings.admin-teams'));
      }
    };

    vm.save = function(isValid) {
      if (!isValid) {
        console.log('not valid');
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teamForm');
        return false;
      }

      if (vm.team._id) {
        console.log('updating team');
        vm.team.$update(successCallback, errorCallback);
      } else {
        console.log('saving new team');
        vm.team.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var teamId = res._id;
        $state.go('settings.admin-team');
      }

      function errorCallback(res) {
        console.log('error: ' + res.data.message);
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('settings.admin-team');
    };

    vm.openFormTeamMember = function(teamMember) {
      vm.teamMember = (teamMember) ? new TeamMembersService(teamMember) : new TeamMembersService();
      vm.teamMember.oldTeamId = angular.copy(teamMember.team._id);
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

    vm.openDeleteTeamMember = function() {
      vm.teamMember = (teamMember) ? new TeamMembersService(teamMember) : new TeamMembersService();
      angular.element('#modal-team-member-delete').modal('show');
    };

    vm.deleteTeamMember = function() {
      vm.teamMember.$remove(function() {
        vm.findTeamMembers();
        vm.findTeams(); 
      });
      angular.element('#modal-team-member-delete').modal('hide');
    };

    vm.cancelDeleteTeamMember = function() {
      angular.element('#modal-team-member-delete').modal('hide');
    };

    vm.openDeleteTeam = function() {
      angular.element('#modal-team-delete').modal('show');
    };

    vm.deleteTeam = function() {
      angular.element('#modal-team-delete').modal('hide');
    };

    vm.cancelDeleteTeam = function() {
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