(function () {
  'use strict';

  angular
    .module('lessons')
    .controller('ProtocolSiteConditionsController', ProtocolSiteConditionsController);

  ProtocolSiteConditionsController.$inject = ['$scope', '$state', 'Authentication', '$stateParams', 'ProtocolSiteConditionsService'];

  function ProtocolSiteConditionsController($scope, $state, Authentication, $stateParams, ProtocolSiteConditionsService) {
    var vm = this;

    vm.protocolSiteCondition = ($stateParams.siteConditionId) ? ProtocolSiteConditionsService.get({
      siteConditionId: $stateParams.siteConditionId
    }).$promise : new ProtocolSiteConditionsService();

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};

    // Remove existing protocol site condition
    vm.remove = function() {
      if (confirm('Are you sure you want to delete?')) {
        vm.protocolSiteCondition.$remove($state.go('protocol-site-conditions.main'));
      }
    };

    // Save protocol site condition
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.protocolSiteConditionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.protocolSiteCondition._id) {
        vm.protocolSiteCondition.$update(successCallback, errorCallback);
      } else {
        vm.protocolSiteCondition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('protocol-site-conditions.view', {
          siteConditionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.cancel = function() {
      $state.go('protocol-site-conditions.main');
    };
  }
})();