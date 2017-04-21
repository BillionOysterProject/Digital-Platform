(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamProfileListController', TeamProfileListController);

  TeamProfileListController.$inject = ['$scope', '$rootScope', '$timeout', '$state', 'TeamsService', 'SchoolOrganizationsService',
    'ExpeditionViewHelper'];

  function TeamProfileListController($scope, $rootScope, $timeout, $state, TeamsService, SchoolOrganizationsService,
    ExpeditionViewHelper) {
    var vm = this;
    vm.newTeam = new TeamsService();

    vm.checkRole = ExpeditionViewHelper.checkRole;
    vm.isTeamLead = vm.checkRole('team lead') || vm.checkRole('team lead pending');
    vm.isAdmin = vm.checkRole('admin');

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
        organization: vm.filter.organization,
        searchString: vm.filter.searchString,
        withMembers: true,
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

    vm.closeTeamProfileForm = function(team) {
      angular.element('#modal-team-edit').modal('hide');
      if (team) {
        $timeout(function() {
          $state.go('profiles.team-view', { teamId: team._id });
        }, 500);
      }
    };
  }
})();
