(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('TeamProfileController', TeamProfileController);

  TeamProfileController.$inject = ['$scope', '$http', 'teamResolve', 'Authentication', 'TeamsService'];

  function TeamProfileController($scope, $http, team, Authentication, TeamsService) {
    var vm = this;

    vm.team = (team) ? team : new TeamsService();
    vm.authentication = Authentication;
    vm.error = [];

    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teamProfileForm');
        return false;
      }

      if (vm.team._id) {
        vm.team.$update(successCallback, errorCallback);
      } else {
        vm.team.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.closeFunction();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.remove = function() {
      vm.team.$remove(function() {
        vm.closeFunction();
      });
    };

    vm.close = function() {
      vm.closeFunction();
    };

    vm.openTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('show');
    };

    vm.closeTeamProfileForm = function() {
      angular.element('#modal-team-edit').modal('hide');
    };

    vm.openInviteTeamLead = function() {
      angular.element('#modal-team-lead-invite').modal('show');
    };

    vm.closeInviteTeamLead = function() {
      angular.element('#modal-team-lead-invite').modal('hide');
    };

    vm.openDeleteTeamLead = function() {
      angular.element('#modal-team-lead-remove').modal('show');
    };

    vm.closeDeleteTeamLead = function() {
      angular.element('#modal-team-lead-remove').modal('hide');
    };
  }
})();
