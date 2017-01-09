'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'lodash',
'Admin', 'SchoolOrganizationsService', 'TeamsService', 'TeamMembersDeleteService',
  function ($scope, $filter, lodash,
    Admin, SchoolOrganizationsService, TeamsService, TeamMembersDeleteService) {
    $scope.filter = {
      organizationId: '',
      role: '',
      searchString: '',
      sort: 'lastName',
      //limit: 20,
      //page: 1
    };

    $scope.organizations = SchoolOrganizationsService.query();
    $scope.deleteTeamMemberError = null;
    $scope.deleteTeamError = null;

    $scope.fieldChanged = function(selection) {
      $scope.findUsers();
    };

    $scope.searchChange = function($event) {
      if ($scope.filter.searchString.length >= 2 || $scope.filter.searchString.length === 0) {
        $scope.filter.page = 1;
        $scope.findUsers();
        //$scope.figureOutItemsToDisplay();
      }
    };

    $scope.findUsers = function() {
      $scope.isSearchingUsers = true;
      Admin.query({
        organizationId: $scope.filter.organizationId,
        role: $scope.filter.role,
        searchString: $scope.filter.searchString,
        sort: $scope.filter.sort,
        //limit: $scope.filter.limit,
        //page: $scope.filter.page,
        showTeams: true
      }, function (data) {
        $scope.users = data;
        $scope.error = null;
        $scope.buildPager();
        $scope.findLeadRequests();
        $scope.isSearchingUsers = false;
      }, function(error) {
        $scope.error = error.data.message;
        $scope.isSearchingUsers = false;
      });
    };
    $scope.findUsers();

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    $scope.listRoles = function (user) {
      if (user.roles && user.roles.length > 0) {
        return user.roles.join(', ');
      } else {
        return '';
      }
    };

    $scope.listTeams = function (user) {
      if (user.teams && user.teams.length) {
        var teamNames = [];
        for (var i = 0; i < user.teams.length; i++) {
          teamNames.push(user.teams[i].name);
        }
        return teamNames.join(', ');
      } else {
        return '';
      }
    };

    $scope.openAdminTeamLeadForm = function(user) {
      $scope.formUser = (user) ? new Admin(angular.copy(user)) : new Admin();

      $scope.formUser.schoolOrg = (user.schoolOrg && user.schoolOrg._id) ? user.schoolOrg._id : user.schoolOrg;
      angular.element('#modal-admin-team-lead-editadd').modal('show');
    };

    $scope.saveAdminTeamLeadForm = function() {
      $scope.findUsers();

      angular.element('#modal-admin-team-lead-editadd').modal('hide');
    };

    $scope.cancelAdminTeamLeadForm = function() {
      angular.element('#modal-admin-team-lead-editadd').modal('hide');
    };

    $scope.openDeleteUser = function(user) {
      $scope.userToDelete = (user) ? new Admin(user) : new Admin();
      angular.element('#modal-delete-user').modal('show');
    };

    $scope.deleteUser = function() {
      $scope.userToDelete.$remove(function() {
        $scope.findUsers();
      });

      $scope.userToDelete = {};
      angular.element('#modal-delete-user').modal('hide');
    };

    $scope.cancelDeleteUser = function() {
      $scope.userToDelete = {};
      angular.element('#modal-delete-user').modal('hide');
    };

    $scope.openDeleteTeamMember = function(member, team) {
      $scope.memberToDelete = member;
      $scope.memberToDeleteTeam = team;
      var result = confirm('Are you sure you want to remove ' + member.displayName + '? The action cannot be undone.');
      if(result) {
        $scope.deleteTeamMember(member, team);
      }
      //angular.element('#modal-delete-team-member').modal('show');
    };

    // $scope.cancelDeleteTeamMember = function() {
    //   $scope.memberToDelete = {};
    //   $scope.memberToDeleteTeam = {};
    //   angular.element('#modal-delete-team-member').modal('hide');
    // };

    $scope.deleteTeamMember = function(teamMember, team) {
      $scope.deleteTeamMemberError = null;
      $scope.deleteTeamError = null;
      teamMember.team = team;
      var teamMemberToDelete = (teamMember) ? new TeamMembersDeleteService(teamMember) : new TeamMembersDeleteService();
      teamMemberToDelete.$remove(function(obj) {
        //reload user list since the user may be deleted
        $scope.findUsers();
        //relead the team list so the members list refreshes
        $scope.team = TeamsService.get({
          teamId: team._id
        });
      }, function(err) {
        $scope.deleteTeamMemberError = err.data.message;
      });
    };

    $scope.openDeleteTeam = function(team) {
      $scope.teamToDelete = team;
      var result = confirm('Are you sure you want to remove ' + team.name + '? The action cannot be undone.');
      if(result) {
        $scope.deleteTeam(team);
      }
    };

    $scope.deleteTeam = function(team) {
      $scope.deleteTeamMemberError = null;
      $scope.deleteTeamError = null;

      var teamToDelete = (team) ? new TeamsService(team) : new TeamsService();
      team.$remove(function(obj) {
        $scope.closeAdminTeam();
        //reload user list since the user may be deleted
        $scope.findUsers();

      }, function(err) {
        $scope.deleteTeamError = 'Error deleting team: ' + err.data.message;
      });
    };

    $scope.findLeadRequests = function() {
      Admin.query({
        role: 'team lead pending',
        //showTeams: true
      }, function (data) {
        $scope.leadRequests = [];
        $scope.leadRequestsOrgPending = [];

        for (var i = 0; i < data.length; i++) {
          if (data[i].schoolOrg && data[i].schoolOrg.pending) {
            $scope.leadRequestsOrgPending.push(data[i]);
          } else {
            $scope.leadRequests.push(data[i]);
          }
        }
      });
    };


    $scope.openApproveTeamLeads = function() {
      $scope.findUsers();
      angular.element('#modal-team-lead-requests').modal('show');
    };

    $scope.saveApproveTeamLeads = function() {
      $scope.findUsers();
      angular.element('#modal-team-lead-requests').modal('hide');
    };

    $scope.closeApproveTeamLeads = function() {
      $scope.findUsers();
      angular.element('#modal-team-lead-requests').modal('hide');
    };

    $scope.openAdminTeam = function(team) {
      $scope.team = team;
      $scope.deleteTeamError = null;
      $scope.deleteTeamMemberError = null;
      angular.element('#modal-admin-team').modal('show');
    };

    $scope.closeAdminTeam = function(team) {
      $scope.team = {};
      $scope.deleteTeamError = null;
      $scope.deleteTeamMemberError = null;
      angular.element('#modal-admin-team').modal('hide');
    };

    $scope.canBeDeleted = function(user) {
      if(user === undefined || user === null) { return false; }
      if($scope.hasRole(user, 'team lead') ||
        $scope.hasRole(user, 'admin') ||
        $scope.hasRole(user, 'team lead pending')) {

        //if the user has one of the above roles and is associated with a team
        //then they should not be able to be deleted. even if the team has no members
        //it could be associated with expeditions and stations - there would need to be
        //a way of transferring ownership of those items to an existing team.
        if(user.teams !== undefined && user.teams !== null && user.teams.length > 0) {
          return false;
        }
      }
      //team members and anyone else who can't own a team can be deleted
      return true;
    };

    $scope.hasRole = function(user, role) {
      var index = lodash.findIndex(user.roles, function(r) {
        return r === role;
      });
      return (index > -1) ? true : false;
    };
  }
]);
