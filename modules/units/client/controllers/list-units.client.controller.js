(function () {
  'use strict';

  angular
    .module('units')
    .controller('UnitsListController', UnitsListController);

  UnitsListController.$inject = ['UnitsService', 'Authentication', 'lodash'];

  function UnitsListController(UnitsService, Authentication, lodash) {
    var vm = this;
    vm.user = Authentication.user;

    var checkRole = function(role) {
      var roleIndex = lodash.findIndex(vm.user.roles, function(o) {
        return o === role;
      });
      return (roleIndex > -1) ? true : false;
    };

    var published = (checkRole('admin')) ? null : true;
    UnitsService.query({
      published: published
    }, function(data) {
      vm.units = data;
    });
  }
})();
