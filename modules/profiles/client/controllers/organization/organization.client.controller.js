(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('OrganizationProfileController', OrganizationProfileController);

  OrganizationProfileController.$inject = ['$scope', '$rootScope', '$http', '$stateParams', '$timeout', '$state', 'Authentication',
    'SchoolOrganizationsService', 'TeamsService', 'ExpeditionViewHelper'];

  function OrganizationProfileController($scope, $rootScope, $http, $stateParams, $timeout, $state, Authentication,
    SchoolOrganizationsService, TeamsService, ExpeditionViewHelper) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = [];

    vm.organization = {};
    vm.team = {};
    vm.userToOpen = {};
    vm.teamToOpen = {};

    var checkRole = ExpeditionViewHelper.checkRole;
    vm.isAdmin = checkRole('admin');
    vm.isTeamLead = checkRole('team lead') || checkRole('team lead pending');

    vm.filter = {
      searchString: '',
      sort: 'name'
    };

    var findTeams = function() {
      TeamsService.query({
        organization: vm.organization._id,
        searchString: vm.filter.searchString,
        sort: vm.filter.searchString,
        full: true
      }, function(data) {
        vm.teams = data;
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
        $rootScope.$broadcast('iso-method', { name:null, params: null });
      });
    });

    vm.clearFilters = function() {
      vm.filter = {
        searchString: '',
        sort: 'name'
      };
      findTeams();
    };

    vm.searchChange = function($event) {
      if (vm.filter.searchString.length >= 2 || vm.filter.searchString.length === 0) {
        vm.filter.page = 1;
        findTeams();
      }
    };

    var findOrganization = function() {
      var organizationId = ($stateParams.schoolOrgId) ? $stateParams.schoolOrgId :
        (vm.organization && vm.organization._id) ? vm.organization._id : vm.organization;
      if (organizationId) {
        SchoolOrganizationsService.get({
          schoolOrgId: organizationId,
          full: true
        }, function(data) {
          vm.organization = (data) ? data : new SchoolOrganizationsService();
          vm.orgPhotoUrl = (vm.organization && vm.organization.photo && vm.organization.photo.path) ?
            vm.organization.photo.path : '';
          findTeams();
        });
      } else {
        vm.organization = new SchoolOrganizationsService();
      }
    };
    findOrganization();

    vm.capitalizeFirstLetter = function(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      } else {
        return '';
      }
    };

    vm.remove = function(callback) {
      vm.organization.$remove(function() {
        if (callback) callback();
      });
    };

    vm.sendReminder = function(lead) {
      $http.post('api/users/leaders/' + lead._id + '/remind', {
        user: lead,
        organization: vm.organization,
        teamOrOrg: 'organization',
        role: 'team lead pending' //TODO chance to 'org lead pending' when that role exists
      })
      .success(function(data, status, headers, config) {
        lead.reminderSent = true;
      })
      .error(function(data, status, headers, config) {
        vm.error = data;
      });
    };

    vm.openInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('show');
    };

    vm.closeInviteOrgLead = function(refresh) {
      angular.element('#modal-org-lead-invite').modal('hide');
      if (refresh) findOrganization();
    };

    vm.openDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('show');
    };

    vm.closeDeleteOrgLead = function(refresh) {
      angular.element('#modal-org-lead-remove').modal('hide');
      if (refresh) findOrganization();
    };

    vm.openViewUserModal = function(user) {
      vm.userToOpen = user;
      angular.element('#modal-profile-user').modal('show');
    };

    vm.closeViewUserModal = function() {
      angular.element('#modal-profile-user').modal('hide');
    };

    vm.openFormTeam = function(team) {
      vm.teamToOpen = (team) ? team : new TeamsService();
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeFormTeam = function(refresh) {
      angular.element('#modal-team-edit').modal('hide');
      if (refresh) findOrganization();
    };

    vm.openFormOrg = function() {
      angular.element('#modal-org-edit').modal('show');
    };

    vm.closeFormOrg = function() {
      angular.element('#modal-org-edit').modal('hide');
      findOrganization();
    };

    vm.openDeleteForm = function() {
      angular.element('#modal-org-delete').modal('show');
    };

    vm.closeDeleteForm = function(redirect) {
      angular.element('#modal-org-delete').modal('hide');
      if (redirect) {
        $timeout(function() {
          $state.go('profiles.organization');
        }, 500);
      }
    };
  }
})();
