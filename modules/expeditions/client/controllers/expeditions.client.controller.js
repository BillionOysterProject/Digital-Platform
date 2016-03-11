(function () {
  'use strict';

  angular
    .module('expeditions')
    .controller('ExpeditionsController', ExpeditionsController);

  ExpeditionsController.$inject = ['$scope', '$state', 'expeditionResolve', 'Authentication'];

  function ExpeditionsController($scope, $state, expedition, Authentication) {
    var vm = this;

    vm.expedition = expedition;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
        $state.go('protocol-site-conditions.create');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
