(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$http', '$timeout', 'Authentication',
    'ExpeditionViewHelper', 'TeamsService', 'Admin'];

  function ProfileController($scope, $http, $timeout, Authentication,
    ExpeditionViewHelper, TeamsService, Admin) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = [];

    vm.user = {};
    vm.organization = {};
    vm.teams = [];

    vm.checkRole = ExpeditionViewHelper.checkRole;
    vm.isTeamLead = vm.checkRole('team lead') || vm.checkRole('team lead pending');

    vm.findCurrentUserAndOrganization = function(callback) {
      $http.get('/api/users/username', {
        params: { username: Authentication.user.username }
      })
      .success(function(data, status, headers, config) {
        vm.user = data;
        vm.organization = data.schoolOrg;
        if (callback) callback();
      })
      .error(function(data, status, headers, config) {

      });
    };
    vm.findCurrentUserAndOrganization();

    vm.findTeams = function(callback) {
      TeamsService.query({
        byOwner: true
      }, function(data) {
        vm.teams = data;
        if (callback) callback();
      });
    };
    vm.findTeams();

    vm.openTeamFormModal = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamFormModal = function() {
      angular.element('#modal-team-edit').modal('hide');
    };

    vm.openViewUserModal = function() {
      vm.findCurrentUserAndOrganization(function() {
        vm.findTeams(function() {
          angular.element('#modal-profile-user').modal('show');
        });
      });
    };

    vm.closeViewUserModal = function(openNewModalName) {
      // angular.element(openNewModalName).modal('show');
      angular.element('#modal-profile-user').modal('hide');
      if (openNewModalName) {
        $timeout(function() {
          angular.element(openNewModalName).modal('show');
        }, 500);
      }
    };
  }
})();
