(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('OrganizationProfileController', OrganizationProfileController);

  OrganizationProfileController.$inject = ['$scope', '$rootScope', '$http', '$stateParams', '$timeout', 'Authentication',
    'SchoolOrganizationsService', 'TeamsService', 'ExpeditionViewHelper'];

  function OrganizationProfileController($scope, $rootScope, $http, $stateParams, $timeout, Authentication,
    SchoolOrganizationsService, TeamsService, ExpeditionViewHelper) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = [];

    vm.organization = {};
    vm.team = {};
    vm.userToOpen = {};

    var checkRole = ExpeditionViewHelper.checkRole;
    vm.isAdmin = checkRole('admin');
    vm.isTeamLead = checkRole('team lead') || checkRole('team lead pending');

    vm.filter = {
      searchString: '',
      sort: 'name'
    };

    var findTeams = function() {
      TeamsService.query({
        organizationId: vm.organization._id,
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

    vm.openInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('show');
    };

    vm.closeInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('hide');
    };

    vm.openDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('show');
    };

    vm.closeDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('hide');
    };

    vm.openViewUserModal = function() {

    };

    vm.openFormTeam = function() {

    };

    vm.openFormOrg = function() {
      angular.element('#modal-org-edit').modal('show');
    };

    vm.closeFormOrg = function() {
      angular.element('#modal-org-edit').modal('hide');
      findOrganization();
    };
  }
})();
