(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('OrganizationProfileController', OrganizationProfileController);

  OrganizationProfileController.$inject = ['$scope', '$http', 'Authentication'];

  function OrganizationProfileController($scope, $http, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = [];

    vm.openInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('show');
    };

    vm.closeInviteOrgLead = function() {
      angular.element('#modal-org-lead-invite').modal('hide');
    };

    vm.openDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('show');
    };

    vm.closeDeleteOrgLead = function() {
      angular.element('#modal-org-lead-remove').modal('hide');
    };
  }
})();
