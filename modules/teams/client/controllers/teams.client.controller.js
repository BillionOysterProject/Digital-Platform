(function () {
  'use strict';

  angular
    .module('teams')
    .controller('TeamsController', TeamsController);

  TeamsController.$inject = ['$scope', '$state', 'teamResolve', 'Authentication'];

  function TeamsController($scope, $state, team, Authentication) {
    var vm = this;

    vm.team = team;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.team.$remove($state.go('settings.admin-teams'));
      }
    };

    vm.save = function(isValid) {
      if (!isValid) {
        console.log('not valid');
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teamForm');
        return false;
      }

      if (vm.team._id) {
        console.log('updating team');
        vm.team.$update(successCallback, errorCallback);
      } else {
        console.log('saving new team');
        vm.team.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var teamId = res._id;
        $state.go('settings.admin-team');
      }

      function errorCallback(res) {
        console.log('error: ' + res.data.message);
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('settings.admin-team');
    };
  }
})();