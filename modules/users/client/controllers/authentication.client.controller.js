'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window',
'lodash', 'Authentication', 'PasswordValidator', 'SchoolOrganizationsService',
  function ($scope, $state, $http, $location, $window, lodash, Authentication, PasswordValidator, SchoolOrganizationsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    vm.signup = function (isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        vm.error = response.message;
      });
    };

    vm.signin = function (isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        var checkRole = function(role) {
          var teamLeadIndex = lodash.findIndex(vm.authentication.user.roles, function(o) {
            return o === role;
          });
          return (teamLeadIndex > -1) ? true : false;
        };

        var dashboard = (checkRole('team lead') || checkRole('team lead pending')) ?
          'curriculum.overview' : 'restoration-stations.dashboard';

        //$state.go($state.previous.state.name || 'home', $state.previous.params);
        $state.go(dashboard);
      }).error(function (response) {
        vm.error = response.message;
      });
    };

    // OAuth provider request
    vm.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };

    // Team Member Request
    vm.schoolOrgs = [];
    vm.teamMemberSelected = false;
    vm.teamLeads = [];
    vm.schoolOrgSelected = false;
    vm.newSchoolOrg = new SchoolOrganizationsService();

    vm.findOrganizations = function (newOrg) {
      SchoolOrganizationsService.query({
        approvedOnly: true
      }, function(data) {
        vm.schoolOrgs = [];
        if (vm.newSchoolOrg && vm.newSchoolOrg.name) {
          vm.schoolOrgs.push({
            '_id' : 'new',
            'name' : vm.newSchoolOrg.name
          });
        }
        for (var i = 0; i < data.length; i++) {
          vm.schoolOrgs.push({
            '_id' : data[i]._id,
            'name' : data[i].name
          });
        }
      });
    };
    vm.findOrganizations();

    vm.schoolOrgFieldSelected = function(schoolOrgId) {
      if (schoolOrgId && vm.credentials.userrole === 'team member pending') {
        vm.schoolOrgSelected = true;
        $http.get('/api/school-orgs/' + schoolOrgId + '/team-leads').success(function (response) {
          vm.teamLeads = response;
        }).error(function (response) {
        });
      } else {
        vm.schoolOrgSelected = false;
      }
    };

    vm.openSchoolOrgForm = function() {
      vm.newSchoolOrg = new SchoolOrganizationsService();
      angular.element('#modal-org-editadd').modal('show');
    };

    vm.saveSchoolOrgForm = function(newSchoolOrg) {
      vm.credentials.schoolOrg = 'new';
      vm.newSchoolOrg = angular.copy(newSchoolOrg);
      vm.credentials.addSchoolOrg = angular.copy(newSchoolOrg);
      vm.findOrganizations();
      angular.element('#modal-org-editadd').modal('hide');
    };

    vm.cancelSchoolOrgForm = function() {
      vm.newSchoolOrg = {};
      angular.element('#modal-org-editadd').modal('hide');
    };
  }
]);
