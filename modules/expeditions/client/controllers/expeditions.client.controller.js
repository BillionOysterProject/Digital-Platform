(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsController', ExpeditionsController);

  ExpeditionsController.$inject = ['$scope', '$rootScope', '$state', 'moment', 'lodash', 'expeditionResolve', 'Authentication',
    'TeamsService', 'TeamMembersService', 'RestorationStationsService'];

  function ExpeditionsController($scope, $rootScope, $state, moment, lodash, expedition, Authentication,
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

      vm.expedition.monitoringStartDate = moment(vm.expedition.monitoringStartDate).toDate();
      vm.expedition.monitoringEndDate = moment(vm.expedition.monitoringEndDate).toDate();
    } else {
      vm.teamId = ($rootScope.teamId) ? $rootScope.teamId : '';
      vm.expedition.monitoringStartDate = moment().startOf('day').hours(8).toDate();
      vm.expedition.monitoringEndDate = moment().startOf('day').hours(16).toDate();
    }

    vm.dateTime = {
      min: moment().subtract(1, 'year').toDate(),
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

    var getORSes = function(callback) {
      if (vm.team) {
        RestorationStationsService.query({
          schoolOrgId: (vm.team && vm.team.schoolOrg && vm.team.schoolOrg._id) ?
            vm.team.schoolOrg._id : vm.team.schoolOrg
        }, function(data) {
          vm.stations = data;
          if (callback) callback();
        });
      }
    };

    vm.findTeamValues = function() {
      if (vm.teamId === '') {
        vm.team = (vm.teams && vm.teams.length > 0) ? vm.teams[0] : null;
        vm.teamId = (vm.team) ? vm.team._id : '';
      } else {
        var teamIndex = lodash.findIndex(vm.teams, function(t) {
          return t._id === vm.teamId;
        });
        vm.team = vm.teams[teamIndex];
      }

      if (vm.teamId) {
        TeamMembersService.query({
          teamId: vm.teamId
        }, function(data) {
          vm.members = data;
          vm.memberLists.members = angular.copy(data);
          vm.memberLists.members.push(angular.copy(vm.team.teamLead));
          vm.member = null;
        });
      }

      getORSes();

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

    var checkRole = function(role) {
      var teamLeadIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (teamLeadIndex > -1) ? true : false;
    };

    vm.checkWrite = function(teamList) {
      if (checkRole('team lead') || checkRole('admin')) {
        return true;
      } else {
        var teamListIndex = lodash.findIndex(teamList, function(m) {
          return m.username === vm.user.username;
        });
        return (teamListIndex > -1) ? true : false;
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
      vm.expedition.$remove(function(err) {
        $rootScope.teamId = vm.teamId;
        $state.go('expeditions.list');
      });
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
        return s._id === vm.stationId;
      });
      if (stationIndex > -1) vm.expedition.station = vm.stations[stationIndex];

      // TODO: move create/update logic to service
      if (vm.expedition._id) {
        vm.expedition.$update(successCallback, errorCallback);
      } else {
        vm.expedition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $rootScope.teamId = vm.teamId;
        $state.go('expeditions.list');
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
      vm.expedition.teamLists = {
        siteCondition: [],
        oysterMeasurement: [],
        mobileTrap: [],
        settlementTiles: [],
        waterQuality: [],
      };
      angular.forEach(vm.expedition.teamLists, function(value, key) {
        keys.push(key);
      });
      if (vm.memberLists.members.length < keys.length) {
        var ml = 0;
        for (var l = 0; l < keys.length; l++) {
          vm.expedition.teamLists[keys[l]].push(vm.memberLists.members[ml]);
          ml++;
          if (ml >= vm.memberLists.members.length) {
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

    vm.openDeleteExpedition = function() {
      angular.element('#modal-delete-expedition').modal('show');
    };

    vm.confirmDeleteExpedition = function(shouldDelete) {
      var element = angular.element('#modal-delete-expedition');
      element.bind('hidden.bs.modal', function () {
        if (shouldDelete) vm.remove();
      });
      element.modal('hide');
    };

    vm.expeditionLink = function(expedition) {
      return ((vm.isTeamLead || vm.isAdmin) && (expedition.status === 'incomplete' || expedition.status === 'returned' ||
        expedition.status === 'unpublished')) ?
      'expeditions.view({ expeditionId: expedition._id })' :
      'expeditions.protocols({ expeditionId: expedition._id })';
    };

    vm.openFormRestorationStation = function(station) {
      vm.station = new RestorationStationsService();

      angular.element('#modal-station-register').modal('show');
    };

    vm.saveFormRestorationStation = function() {
      getORSes(function() {
        vm.stationId = vm.station._id;
        vm.station = {};

        angular.element('#modal-station-register').modal('hide');
      });
    };

    vm.cancelFormRestorationStation = function() {
      vm.station = {};

      angular.element('#modal-station-register').modal('hide');
    };

    $scope.openViewUserModal = function(user) {
      $scope.userToView = user || {};
      angular.element('#modal-profile-user').modal('show');
    };

    $scope.closeViewUserModal = function(refresh) {
      angular.element('#modal-profile-user').modal('hide');
    };
  }
})();
