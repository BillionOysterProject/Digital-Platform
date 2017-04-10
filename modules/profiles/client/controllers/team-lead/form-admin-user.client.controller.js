(function() {
  'use strict';

  angular
    .module('profiles')
    .controller('FormAdminUserController', FormAdminUserController);

  FormAdminUserController.$inject = ['$scope', '$http', 'lodash', 'Authentication',
    'Users', 'TeamsService', 'SchoolOrganizationsService'];

  function FormAdminUserController($scope, $http, lodash, Authentication,
    Users, TeamsService, SchoolOrganizationsService) {
    $scope.currentUser = Authentication.user;
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
      var newAdminValue = $scope.isAdmin;
      if(newAdminValue) {
        $scope.user.roles.push('admin');
      } else {
        var roleIndex = lodash.findIndex($scope.user.roles, function(r) {
          return r === 'admin';
        });
        if (roleIndex > -1) {
          $scope.user.roles.splice(roleIndex, 1);
        }
      }
    };

    $scope.selectedRoleChanged = function() {
      var newSelectedRole = $scope.selectedRole;
      var roleIndex = -1;
      if(newSelectedRole === 'team member') {
        $scope.user.teamLeadType = undefined;
        $scope.isAdmin = false;
        roleIndex = lodash.findIndex($scope.user.roles, function(r) {
          return r === 'team lead';
        });
        if (roleIndex > -1) {
          $scope.user.roles.splice(roleIndex, 1);
        }

        roleIndex = lodash.findIndex($scope.user.roles, function(r) {
          return r === 'admin';
        });
        if (roleIndex > -1) {
          $scope.user.roles.splice(roleIndex, 1);
        }
      } else if(newSelectedRole === 'team lead') {
        roleIndex = lodash.findIndex($scope.user.roles, function(r) {
          return r === 'team member';
        });
        if (roleIndex > -1) {
          $scope.user.roles.splice(roleIndex, 1);
        }
      }
      $scope.user.roles.push(newSelectedRole);
    };

    $scope.checkCurrentUserIsUser = function() {
      if ($scope.user && $scope.currentUser && $scope.user.username && $scope.currentUser.username &&
      $scope.user.username === $scope.currentUser.username) {
        return true;
      } else {
        return false;
      }
    };

    $scope.saveAdminTeamLeadForm = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'form.adminTeamLeadForm');
        return false;
      }

      //$scope.user.$update(successCallback, errorCallback);
      if ($scope.user._id) {
        $http.put('api/users/leaders/' + $scope.user._id, {
          user: $scope.user
        })
        .success(successCallback)
        .error(errorCallback);
      }

      function successCallback(res) {
        // $scope.findUsers();
        // $scope.cancelAdminTeamLeadForm();
        $scope.closeFunction(true);
      }

      function errorCallback(res) {
        console.log('res', res);
        $scope.editUserError = res.data.message;
      }
    };

    $scope.close = function() {
      $scope.closeFunction();
    };
  }
})();
