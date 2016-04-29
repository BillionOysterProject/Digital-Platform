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
    vm.teamId = '';
    vm.authentication = Authentication;
    vm.user = vm.authentication.user;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.memberLists = {
      'selected': null,
      'members': []
    };

    if (vm.expedition._id) {
      vm.teamId = (vm.expedition.team && vm.expedition.team._id) ? vm.expedition.team._id : vm.expedition.team;
      vm.stationId = (vm.expedition.station && vm.expedition.station._id) ? vm.expedition.station._id : vm.expedition.station;
      
      console.log('vm.teamId', vm.teamId);
      console.log('vm.stationId', vm.stationId);

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
        console.log('teams', vm.teams);
        vm.findTeamValues();
      });
    };

    vm.findTeams();

    vm.findTeamValues = function() {
      if (vm.teamId === '') {
        vm.team = (vm.teams && vm.teams.length > 0) ? vm.teams[0] : null;
        vm.teamId = (vm.team) ? vm.team._id : '';
      } else {
        console.log('teamId not null');
        var teamIndex = lodash.findIndex(vm.teams, function(t) {
          return t._id === vm.teamId;
        });
        vm.team = vm.teams[teamIndex];
        console.log('vm.team', vm.team);
      }

      if (vm.teamId) {
        TeamMembersService.query({
          teamId: vm.teamId
        }, function(data) {
          vm.members = data;
          vm.memberLists.members = angular.copy(data);
          vm.member = null;
        });
      }

      if (vm.team) {
        console.log('vm.team', vm.team);
        RestorationStationsService.query({
          schoolOrgId: (vm.team && vm.team.schoolOrg && vm.team.schoolOrg._id) ?
            vm.team.schoolOrg._id : vm.team.schoolOrg
        }, function(data) {
          vm.stations = data;
          if (!vm.expedition.station || vm.expedition.station === undefined) {
            vm.expedition.station = vm.stations[0];
          }
        });
      }

      if (!vm.expedition.teamLists || vm.expedition.teamLists === undefined) {
        vm.expedition.teamLists = {
          siteCondition: [],
          oysterMeasurement: [],
          mobileTrap: [],
          settlementTiles: [],
          waterQuality: [],
        };
      }
    };

    vm.fieldChanged = function(team) {
      vm.team = team;
      vm.expedition.teamLists = {
        siteCondition: [],
        oysterMeasurement: [],
        mobileTrap: [],
        settlementTiles: [],
        waterQuality: [],
      };
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

      // check protocol team lists
      if (vm.expedition.teamLists.siteCondition.length === 0 ||
        vm.expedition.teamLists.oysterMeasurement.length === 0 ||
        vm.expedition.teamLists.mobileTrap.length === 0 ||
        vm.expedition.teamLists.settlementTiles.length === 0 ||
        vm.expedition.teamLists.waterQuality.length === 0) {
        vm.form.expeditionForm.$setValidity('lists', false);
        $scope.$broadcast('show-errors-check-validity', 'vm.form.expeditionForm');
        return false;
      }

      // set team
      var teamIndex = lodash.findIndex(vm.teams, function(t) {
        return t._id === vm.teamId;
      });
      if (teamIndex > -1) vm.expedition.team = vm.teams[teamIndex];

      var stationIndex = lodash.findIndex(vm.stations, function(s) {
        console.log('s', s);
        return s._id === vm.stationId;
      });
      if (stationIndex > -1) vm.expedition.station = vm.stations[stationIndex];
      console.log('stationIndex', stationIndex);
      console.log('vm.stations', vm.stations);
      console.log('vm.stations[stationIndex]', vm.stations[stationIndex]);
      console.log('vm.expedition.station', vm.expedition.station);

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
      angular.forEach(vm.expedition.teamLists, function(value, key) {
        keys.push(key);
      });
      if (vm.memberLists.members.length < keys.length) {
        var ml = 0;
        for (var l = 0; l < keys.length; l++) {
          vm.expedition.teamLists[keys[l]].push(vm.memberLists.members[ml]);
          ml++;
          if (ml >= vm.memberLists.members.length) {
            console.log('resetting member index');
            ml = 0;
          }
        }
      } else if (vm.memberLists.members.length === keys.length) {
        for (var e = 0; e < keys.length; e++) {
          vm.expedition.teamLists[keys[e]].push(vm.memberLists.members[e]);
        }
      } else {
        var ll = 0;
        for (var g = 0; g < vm.memberLists.members.length; g++) {
          vm.expedition.teamLists[keys[ll]].push(vm.memberLists.members[g]);
          ll++;
          if (ll >= keys.length) {
            ll = 0;
          }
        }
      }
    };
  }
})();
