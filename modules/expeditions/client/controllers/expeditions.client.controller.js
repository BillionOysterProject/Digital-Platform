(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsController', ExpeditionsController);

  ExpeditionsController.$inject = ['$scope', '$state', 'moment', 'lodash', 'expeditionResolve', 'Authentication',
  'TeamsService', 'TeamMembersService', 'RestorationStationsService'];

  function ExpeditionsController($scope, $state, moment, lodash, expedition, Authentication,
  TeamsService, TeamMembersService, RestorationStationsService) {
    var vm = this;

    vm.expedition = expedition;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.dateTime = {
      min: moment().subtract(7, 'days').toDate(),
      max: moment().add(1, 'year').toDate()
    };

    vm.memberLists = {
      'selected': null,
      'lists': {
        'Members': [],
        'Site Conditions': [],
        'Oyster Measurements': [],
        'Mobile Trap': [],
        'Settlement Tiles': [],
        'Water Quality': []
      }
    };

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
      if (!vm.expedition.team || vm.expedition.team === undefined) {
        vm.expedition.team = vm.teams[0];
        vm.expedition.monitoringStartDate = moment().startOf('day').hours(8).toDate();
        vm.expedition.monitoringEndDate = moment().startOf('day').hours(16).toDate();
      }

      var teamId = (vm.expedition.team) ? vm.expedition.team._id : '';

      TeamMembersService.query({
        teamId: teamId
      }, function(data) {
        vm.members = data;
        vm.memberLists.lists.Members = angular.copy(data);
        vm.member = null;
      });

      RestorationStationsService.query({
        teamId: teamId
      }, function(data) {
        vm.stations = data;
        if (!vm.expedition.station || vm.expedition.station === undefined) {
          vm.expedition.station = vm.stations[0];
        }
      });
    };

    vm.fieldChanged = function(team) {
      vm.team = team;
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

    vm.isInList = function(item, list) {
      console.log('in list', list);
      var index = lodash.findIndex(list, function(i) {
        return i._id === item._id;
      });
      console.log('index', index);
      return (index > -1) ? true : false;
    };

  }
})();
