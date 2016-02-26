(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsController', UnitsController);

  UnitsController.$inject = ['$scope', '$state', 'unitResolve', 'Authentication'];

  function UnitsController($scope, $state, unit, Authentication) {
    var vm = this;

    vm.unit = unit;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    // Remove existing Unit
    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.unit.$remove($state.go('units.list'));
      }
    };

    // Save Unit
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.unitForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.unit._id) {
        vm.unit.$update(successCallback, errorCallback);
      } else {
        vm.unit.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('units.view', {
          unitId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('units.list');
    };
  }
})();
