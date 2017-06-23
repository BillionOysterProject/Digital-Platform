'use strict';

angular.module('profiles').controller('UserListController', ['$scope', '$filter', 'lodash',
  'Admin', 'SchoolOrganizationsService', 'TeamsService', 'ExpeditionViewHelper',
  function ($scope, $filter, lodash,
    Admin, SchoolOrganizationsService, TeamsService, ExpeditionViewHelper) {
    $scope.checkRole = ExpeditionViewHelper.checkRole;
    $scope.isAdmin = $scope.checkRole('admin');
    $scope.isTeamLead = $scope.checkRole('team lead');
    $scope.isTeamMember = $scope.checkRole('team member');

    $scope.filter = {
      organizationId: '',
      role: '',
      teamLeadType: '',
      searchString: '',
      sort: 'lastName',
      limit: 15,
      page: 1
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
      }
    };

    $scope.findUsers = function() {
      $scope.isSearchingUsers = true;
      Admin.query({
        organizationId: $scope.filter.organizationId,
        role: $scope.filter.role,
        teamLeadType: $scope.filter.teamLeadType,
        searchString: $scope.filter.searchString,
        sort: $scope.filter.sort,
        limit: $scope.filter.limit,
        page: $scope.filter.page,
        showTeams: true
      }, function (data) {
        $scope.filterLength = data.totalCount;
        $scope.itemsPerPage = $scope.filter.limit;
        $scope.users = data.users;
        $scope.error = null;
        $scope.findLeadRequests();
        $scope.isSearchingUsers = false;
      }, function(error) {
        $scope.error = error.data.message;
        $scope.isSearchingUsers = false;
      });
    };
    $scope.findUsers();

    $scope.pageChanged = function () {
      $scope.filter.page = $scope.currentPage;
      $scope.findUsers();
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

    $scope.teamLeadType = [
      { label: 'Teacher', value: 'teacher' },
      { label: 'Citizen Scientist', value: 'citizen scientist' },
      { label: 'Professional Scientist', value: 'professional scientist' },
      { label: 'Site Coordinator', value: 'site coordinator' },
      { label: 'Other', value: 'other' }
    ];

    $scope.findLeadRequests = function() {
      Admin.query({
        role: 'team lead pending',
        //showTeams: true
      }, function (data) {
        $scope.leadRequests = [];
        $scope.leadRequestsOrgPending = [];

        for (var i = 0; i < data.users.length; i++) {
          if (data.users[i].schoolOrg && data.users[i].schoolOrg.pending) {
            $scope.leadRequestsOrgPending.push(data.users[i]);
          } else {
            $scope.leadRequests.push(data.users[i]);
          }
        }
      });
    };


    $scope.openApproveTeamLeads = function() {
      $scope.findUsers();
      angular.element('#modal-team-lead-requests').modal('show');
    };

    $scope.closeApproveTeamLeads = function() {
      $scope.findUsers();
      $scope.findLeadRequests();
      angular.element('#modal-team-lead-requests').modal('hide');
    };

    $scope.openApproveOrganizations = function() {
      $scope.findUsers();
      angular.element('#modal-org-requests').modal('show');
    };

    $scope.closeApproveOrganizations = function() {
      $scope.findUsers();
      $scope.findLeadRequests();
      angular.element('#modal-org-requests').modal('hide');
    };

    $scope.openViewUserModal = function(user) {
      $scope.userToOpen = new Admin(user);
      $scope.initial = 'userView';
      angular.element('#modal-profile-user').modal('show');
    };

    $scope.closeViewUserModal = function(refresh) {
      $scope.userToOpen = {};
      if (refresh) $scope.findUsers();
      angular.element('#modal-profile-user').modal('hide');
    };

    $scope.hasRole = function(user, role) {
      var index = lodash.findIndex(user.roles, function(r) {
        return r === role;
      });
      return (index > -1) ? true : false;
    };
  }
]);
