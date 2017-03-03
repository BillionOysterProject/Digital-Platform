(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('FormAdminUserController', FormAdminUserController);

  FormAdminUserController.$inject = ['$scope', '$http', 'lodash', 'Authentication',
    'Users', 'TeamsService', 'SchoolOrganizationsService'];

  function FormAdminUserController($scope, $http, lodash, Authentication,
    Users, TeamsService, SchoolOrganizationsService) {
    $scope.user = Authentication.user;
    $scope.roles = [
      { name: 'Team Lead', value: 'team lead' },
      { name: 'Team Member', value: 'team member' }
    ];

    $scope.teamLeadType = [
      { label: 'Teacher', value: 'teacher' },
      { label: 'Citizen Scientist', value: 'citizen scientist' },
      { label: 'Professional Scientist', value: 'professional scientist' },
      { label: 'Site Coordinator', value: 'site coordinator' },
      { label: 'Other', value: 'other' }
    ];

    if (!$scope.organizations) $scope.organizations = SchoolOrganizationsService.query();

    $scope.isAdminChanged = function() {
      var newAdminValue = this.isAdmin;
      if(newAdminValue) {
        this.user.roles.push('admin');
      } else {
        var roleIndex = lodash.findIndex(this.user.roles, function(r) {
          return r === 'admin';
        });
        if (roleIndex > -1) {
          this.user.roles.splice(roleIndex, 1);
        }
      }
    };

    $scope.selectedRoleChanged = function() {
      var newSelectedRole = this.selectedRole;
      var roleIndex = -1;
      if(newSelectedRole === 'team member') {
        this.user.teamLeadType = undefined;
        this.isAdmin = false;
        roleIndex = lodash.findIndex(this.user.roles, function(r) {
          return r === 'team lead';
        });
        if (roleIndex > -1) {
          this.user.roles.splice(roleIndex, 1);
        }

        roleIndex = lodash.findIndex(this.user.roles, function(r) {
          return r === 'admin';
        });
        if (roleIndex > -1) {
          this.user.roles.splice(roleIndex, 1);
        }
      } else if(newSelectedRole === 'team lead') {
        roleIndex = lodash.findIndex(this.user.roles, function(r) {
          return r === 'team member';
        });
        if (roleIndex > -1) {
          this.user.roles.splice(roleIndex, 1);
        }
      }
      this.user.roles.push(newSelectedRole);
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
