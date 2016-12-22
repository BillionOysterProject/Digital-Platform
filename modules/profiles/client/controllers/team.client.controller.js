(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamProfileController', TeamProfileController);

  TeamProfileController.$inject = ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$timeout', 'Authentication',
    'TeamsService', 'TeamMembersService', 'ExpeditionsService', 'LeaderMemberService', 'Admin', 'ExpeditionViewHelper',
    'TeamRequestsService', 'FileUploader'];

  function TeamProfileController($scope, $rootScope, $http, $state, $stateParams, $timeout, Authentication,
      TeamsService, TeamMembersService, ExpeditionsService, LeaderMemberService, Admin, ExpeditionViewHelper,
      TeamRequestsService, FileUploader) {
    var vm = this;
    vm.team = {};
    vm.userToOpen = {};

    var checkRole = ExpeditionViewHelper.checkRole;
    vm.isAdmin = checkRole('admin');
    vm.isTeamLead = checkRole('team lead') || checkRole('team lead pending');

    vm.filter = {
      searchString: '',
      sort: 'lastName'
    };

    var findTeamMembers = function() {
      TeamMembersService.query({
        teamId: vm.team._id,
        searchString: vm.filter.searchString,
        sort: vm.filter.sort
      }, function(data) {
        vm.teamMembers = data;
        vm.error = null;
        $timeout(function() {
          $rootScope.$broadcast('iso-method', { name:null, params:null });
        });
      }, function(error) {
        vm.error = error.data.message;
      });
    };

    $scope.$on('$viewContentLoaded', function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params:null });
      });
    });

    vm.clearFilters = function() {
      vm.filter = {
        searchString: '',
        sort: 'lastName'
      };
      findTeamMembers();
    };

    vm.searchChange = function($event) {
      if (vm.filter.searchString.length >= 2 || vm.filter.searchString.length === 0) {
        vm.filter.page = 1;
        findTeamMembers();
      }
    };

    var findExpeditions = function(teamId) {
      ExpeditionsService.query({
        team: teamId,
        published: true
      }, function(data) {
        vm.expeditions = data;
      });
    };

    var findTeam = function() {
      var teamId = ($stateParams.teamId) ? $stateParams.teamId : (vm.team && vm.team._id) ? vm.team._id : vm.team;
      if (teamId) {
        TeamsService.get({
          teamId: teamId,
          full: true
        }, function(data) {
          vm.team = (data) ? data : new TeamsService();
          vm.teamPhotoURL = (vm.team && vm.team.photo && vm.team.photo.path) ? vm.team.photo.path : '';
          findExpeditions(vm.team._id);
          findTeamMembers();
        });
      } else {
        vm.team = new TeamsService();
      }
    };
    findTeam();

    vm.findTeamRequests = function() {
      TeamRequestsService.query({
        byOwner: true
      }, function(data) {
        vm.teamRequests = data;
      });
    };
    vm.findTeamRequests();

    vm.authentication = Authentication;
    vm.error = [];

    vm.remove = function(callback) {
      vm.team.$remove(function() {
        if (callback) callback();
      });
    };

    vm.sendReminder = function(lead) {
      $http.post('api/users/leaders/' + lead._id + '/remind', {
        user: lead,
        organization: vm.team.schoolOrg,
        team: vm.team,
        teamOrOrg: 'team',
        role: 'team lead pending'
      })
      .success(function(data, status, headers, config) {
        lead.reminderSent = true;
      })
      .error(function(data, status, headers, config) {
        vm.error = data;
      });
    };

    vm.openTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamProfileForm = function(data) {
      angular.element('#modal-team-edit').modal('hide');
      if (data) findTeam();
    };

    vm.openInviteTeamLead = function() {
      angular.element('#modal-team-lead-invite').modal('show');
    };

    vm.closeInviteTeamLead = function(refresh) {
      angular.element('#modal-team-lead-invite').modal('hide');
      if (refresh) findTeam();
    };

    vm.openFormTeamMember = function(member) {
      vm.userToOpen = member;
      angular.element('#modal-team-member-editadd').modal('show');
    };

    vm.closeFormTeamMember = function(refresh) {
      angular.element('#modal-team-member-editadd').modal('hide');
      if (refresh) findTeam();
    };

    vm.openDeleteTeamMember = function(member) {
      vm.userToOpen = member;
      angular.element('#modal-team-member-delete').modal('show');
    };

    vm.closeDeleteTeamMember = function(refresh) {
      angular.element('#modal-team-member-delete').modal('hide');
      if (refresh) findTeam();
    };

    vm.openImportTeamMembers = function() {
      angular.element('#modal-import-team-members').modal('show');
    };

    vm.closeImportTeamMembers = function() {
      angular.element('#modal-import-team-members').modal('hide');
    };

    vm.openDeleteTeamLead = function() {
      angular.element('#modal-team-lead-remove').modal('show');
    };

    vm.closeDeleteTeamLead = function(refresh) {
      angular.element('#modal-team-lead-remove').modal('hide');
      if (refresh) findTeam();
    };

    vm.openDeleteTeam = function() {
      angular.element('#modal-team-delete').modal('show');
    };

    vm.closeDeleteTeam = function(refresh) {
      angular.element('#modal-team-delete').modal('hide');
      if (refresh) {
        $timeout(function() {
          $state.go('profiles.team');
        }, 500);
      }
    };

    vm.openViewUserModal = function(user) {
      vm.userToOpen = (user) ? user : new Admin();
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function(openNewModalName) {
      angular.element('#modal-profile-user').modal('hide');
    };

    vm.openApproveTeamMembers = function() {

    };

    vm.closeApproveTeamMembers = function() {

    };
  }
})();
