(function() {
  'use strict';

  angular
    .module('school-orgs')
    .controller('SchoolOrganizationsControllers', SchoolOrganizationsControllers);

  SchoolOrganizationsControllers.$inject = ['$scope', '$state', 'Authentication'];

  function SchoolOrganizationsControllers($scope, $state, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
  }
})();
