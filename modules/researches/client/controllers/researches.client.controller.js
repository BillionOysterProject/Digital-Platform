(function () {
  'use strict';

  // Researches controller
  angular
    .module('researches')
    .controller('ResearchesController', ResearchesController);

  ResearchesController.$inject = ['$scope', '$state', '$window', 'Authentication'];

  function ResearchesController ($scope, $state, $window, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Research
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.research.$remove($state.go('researches.list'));
      }
    }

    // Save Research
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.researchForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.research._id) {
        vm.research.$update(successCallback, errorCallback);
      } else {
        vm.research.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('researches.view', {
          researchId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
