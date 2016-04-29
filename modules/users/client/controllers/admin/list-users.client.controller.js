'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', 'SchoolOrganizationsService',
  function ($scope, $filter, Admin, SchoolOrganizationsService) {
    $scope.filter = {
      organizationId: '',
      role: '',
      searchString: '',
      sort: '',
      limit: 20,
      page: 1
    };

    $scope.organizations = SchoolOrganizationsService.query();

    $scope.fieldChanged = function(selection) {
      $scope.findUsers();
    };

    $scope.searchChange = function($event) {
      if ($scope.filter.searchString.length >= 3 || $scope.filter.searchString.length === 0) {
        $scope.filter.page = 1;
        $scope.findUsers();
        $scope.figureOutItemsToDisplay();
      }
    };

    $scope.findUsers = function() {
      Admin.query({
        organizationId: $scope.filter.organizationId,
        role: $scope.filter.role,
        searchString: $scope.filter.searchString,
        sort: $scope.filter.sort,
        limit: $scope.filter.limit,
        page: $scope.filter.page,
        showTeams: true
      }, function (data) {
        $scope.users = data;
        $scope.error = null;
        $scope.buildPager();
        $scope.findLeadRequests();
      }, function(error) {
        $scope.error = error.data.message;
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

    $scope.openDeleteAdminTeamLead = function(user) {
      $scope.userToDelete = (user) ? new Admin(user) : new Admin();
      angular.element('#modal-delete-admin-team-lead').modal('show');
    };

    $scope.deleteAdminTeamLead = function() {
      $scope.userToDelete.$remove(function() {
        $scope.findUsers();
      });

      $scope.userToDelete = {};
      angular.element('#modal-delete-admin-team-lead').modal('hide');
    };

    $scope.cancelDeleteAdminTeamLead = function() {
      $scope.userToDelete = {};
      angular.element('#modal-delete-admin-team-lead').modal('hide');
    };

    $scope.findLeadRequests = function() {
      Admin.query({
        role: 'team lead pending',
        showTeams: true
      }, function (data) {
        $scope.leadRequests = [];
        $scope.leadRequestsOrgPending = [];

        for (var i = 0; i < data.length; i++) {
          if (data[i].schoolOrg.pending) {
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
      angular.element('#modal-admin-team').modal('show');
    };

    $scope.closeAdminTeam = function(team) {
      $scope.team = {};
      angular.element('#modal-admin-team').modal('hide');
    };
  }
]);
