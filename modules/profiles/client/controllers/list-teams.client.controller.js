(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamProfileListController', TeamProfileListController);

  TeamProfileListController.$inject = ['$scope', '$rootScope', '$timeout', 'TeamsService', 'SchoolOrganizationsService',
    'ExpeditionViewHelper'];

  function TeamProfileListController($scope, $rootScope, $timeout, TeamsService, SchoolOrganizationsService,
    ExpeditionViewHelper) {
    var vm = this;

    vm.checkRole = ExpeditionViewHelper.checkRole;
    vm.isTeamLead = vm.checkRole('team lead') || vm.checkRole('team lead pending');

    vm.filter = {
      organization: '',
      organizationName: '',
      searchString: '',
      sort: ''
    };

    vm.clearFilters = function() {
      vm.filter = {
        organization: '',
        organizationName: '',
        searchString: '',
        sort: ''
      };
      vm.findTeams();
    };

    vm.findTeams = function() {
      TeamsService.query({
        schoolOrg: vm.filter.organization,
        searchString: vm.filter.searchString,
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

    vm.findTeams();

    vm.organizationSelected = function(selection) {
      vm.filter.organization = (selection) ? selection._id : '';
      vm.filter.organizationName = (selection) ? selection.name : '';
      vm.findTeams();
    };

    vm.searchChange = function($event) {
      if (vm.filter.searchString.length >= 3 || vm.filter.searchString.length === 0) {
        vm.findTeams();
      }
    };

    SchoolOrganizationsService.query({
      approvedOnly: true
    }, function(data) {
      vm.organizations = data;
    });

    $scope.$on('$viewContentLoaded', function() {
      $timeout(function() {
        $rootScope.$broadcast('iso-method', { name:null, params: null });
      });
    });

    vm.openTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('hide');
    };
  }
})();
