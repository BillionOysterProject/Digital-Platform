(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsListController', UnitsListController);

  UnitsListController.$inject = ['UnitsService', 'Authentication', 'lodash'];

  function UnitsListController(UnitsService, Authentication, lodash) {
    var vm = this;
    vm.user = Authentication.user;

    vm.filter = {
      publishedStatus: 'published'
    };

    var checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };
    vm.isAdmin = checkRole('admin');

    vm.findUnits = function() {
      UnitsService.query({
        publishedStatus: vm.filter.publishedStatus
      }, function(data) {
        vm.units = data;
      });
    };
    vm.findUnits();

    vm.publishedStatusSelected = function(status) {
      vm.filter.publishedStatus = status;
      vm.findUnits();
    };
  }
})();
