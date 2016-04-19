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
    console.log('expedition', expedition);
    vm.teamId = '';
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.memberLists = {
      'selected': null,
      'members': []
    };

    if (vm.expedition._id) {
      vm.teamId = (vm.expedition.team) ? vm.expedition.team._id : '';
      console.log('vm.expedition.team', vm.expedition.team);

      vm.expedition.monitoringStartDate = moment(vm.expedition.monitoringStartDate).toDate();
      vm.expedition.monitoringEndDate = moment(vm.expedition.monitoringEndDate).toDate();
    } else {
      vm.expedition.monitoringStartDate = moment().startOf('day').hours(8).toDate();
      vm.expedition.monitoringEndDate = moment().startOf('day').hours(16).toDate();
    }

    vm.dateTime = {
      min: moment().subtract(7, 'days').toDate(),
      max: moment().add(1, 'year').toDate()
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
      if (vm.teamId === '') {
        vm.team = vm.teams[0];
        vm.teamId = vm.team._id;
      }

      TeamMembersService.query({
        teamId: vm.teamId
      }, function(data) {
        vm.members = data;
        vm.memberLists.members = angular.copy(data);
        vm.member = null;
      });

      RestorationStationsService.query({
        teamId: vm.teamId
      }, function(data) {
        vm.stations = data;
        if (!vm.expedition.station || vm.expedition.station === undefined) {
          vm.expedition.station = vm.stations[0];
        }
      });

      vm.memberLists.protocols = {
        'Site Conditions': [],
        'Oyster Measurements': [],
        'Mobile Trap': [],
        'Settlement Tiles': [],
        'Water Quality': []
      };
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

      // set team
      var index = lodash.findIndex(vm.teams, function(t) {
        return t._id === vm.teamId;
      });
      if (index > -1) vm.expedition.team = vm.teams[index];

      console.log('expedition start', vm.expedition.monitoringStartDate);
      console.log('expedition end', vm.expedition.monitoringEndDate);

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
      var index = lodash.findIndex(list, function(i) {
        return i._id === item._id;
      });
      return (index > -1) ? true : false;
    };

    vm.onDrop = function(list, item) {
      if (!vm.isInList(item, list)) {
        list.push(item);
      }
      return true;
    };

    vm.autoAssign = function() {
      var keys = [];
      angular.forEach(vm.memberLists.protocols, function(value, key) {
        keys.push(key);
      });
      if (vm.memberLists.members.length < keys.length) {
        var ml = 0;
        for (var l = 0; l < keys.length; l++) {
          vm.memberLists.protocols[keys[l]].push(vm.memberLists.members[ml]);
          ml++;
          if (ml >= vm.memberLists.members.length) {
            ml = 0;
          }
        }
      } else if (vm.memberLists.members.length === keys.length) {
        for (var e = 0; e < keys.length; e++) {
          vm.memberLists.protocols[keys[e]].push(vm.memberLists.members[e]);
        }
      } else {
        var ll = 0;
        for (var g = 0; g < vm.memberLists.members.length; g++) {
          vm.memberLists.protocols[keys[ll]].push(vm.memberLists.members[g]);
          ll++;
          if (ll >= keys.length) {
            ll = 0;
          }
        }
      }
    };
  }
})();
