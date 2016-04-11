(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsController', ExpeditionsController);

  ExpeditionsController.$inject = ['$scope', '$state', 'expeditionResolve', 'Authentication',
  'TeamsService', 'TeamMembersService', 'RestorationStationsService'];

  function ExpeditionsController($scope, $state, expedition, Authentication,
  TeamsService, TeamMembersService, RestorationStationsService) {
    var vm = this;

    vm.expedition = expedition;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.findTeams = function() {
      TeamsService.query({
        byOwner: true
      }, function(data) {
        vm.teams = data;
        vm.findTeamValues();
      });
    };

    vm.findTeams();

    vm.findTeamValues = function() {
      if (!vm.expedition.team && vm.expedition.team === null) {
        vm.expedition.team = vm.teams[0];
      }

      var teamId = (vm.expedition.team) ? vm.expedition.team._id : '';

      TeamMembersService.query({
        teamId: teamId
      }, function(data) {
        vm.members = data;
      });

      RestorationStationsService.query({
        teamId: teamId
      }, function(data) {
        vm.stations = data;
      });
    };

    vm.fieldChanged = function($event) {
      vm.findTeamValues();
    };

    // Remove existing Expedition
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.expedition.$remove($state.go('expeditions.list'));
      }
    }

    // Save Expedition
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.expeditionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.expedition._id) {
        vm.expedition.$update(successCallback, errorCallback);
      } else {
        vm.expedition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('restoration-stations.dashboard');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
