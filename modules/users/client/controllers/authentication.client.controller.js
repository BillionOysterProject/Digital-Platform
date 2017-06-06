'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$rootScope', '$state', '$http',
  '$location', '$window', 'lodash', 'Authentication', 'PasswordValidator', 'SchoolOrganizationsService',
  function ($scope, $rootScope, $state, $http,
    $location, $window, lodash, Authentication, PasswordValidator, SchoolOrganizationsService) {
    var vm = this;
    vm.isSubmitting = false;
    vm.hasAcceptedTermsOfUse = false;
    vm.authentication = Authentication;
    vm.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    vm.signup = function (isValid) {
      if(!vm.hasAcceptedTermsOfUse) {
        vm.error = 'Please read and agree to the Terms of Use before completing sign up.';
        isValid = false;
      } else {
        vm.error = null;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      vm.isSubmitting = true;
      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        vm.isSubmitting = false;
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        if ($rootScope.redirectFromLogin) {
          $location.path($rootScope.redirectFromLogin);
        } else {
          // And redirect to the previous or home page
          var toGoState = $state.previous.state.name;
          if(!toGoState || toGoState === 'home') {
            toGoState = 'restoration-stations.dashboard';
          }
          $state.go(toGoState, $state.previous.params);
        }
      }).error(function (response) {
        vm.isSubmitting = false;
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

        if ($rootScope.redirectFromLogin) {
          $location.path($rootScope.redirectFromLogin);
        } else {
          // And redirect to the previous or home page
          var checkRole = function(role) {
            var teamLeadIndex = lodash.findIndex(vm.authentication.user.roles, function(o) {
              return o === role;
            });
            return (teamLeadIndex > -1) ? true : false;
          };

          //var dashboard = (checkRole('team lead') || checkRole('team lead pending')) ?
          //  'lessons.list' : 'restoration-stations.dashboard';

          //$state.go($state.previous.state.name || dashboard, $state.previous.params);
          $state.go('restoration-stations.dashboard');
        }
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
    vm.teamLeadSelected = false;
    vm.newSchoolOrg = new SchoolOrganizationsService();

    vm.teamLeadType = [
      { label: 'Teacher', value: 'teacher' },
      { label: 'Citizen Scientist', value: 'citizen scientist' },
      { label: 'Professional Scientist', value: 'professional scientist' },
      { label: 'Site Coordinator', value: 'site coordinator' },
      { label: 'Other', value: 'other' }
    ];

    vm.findOrganizations = function (newOrg) {
      SchoolOrganizationsService.query({
        approvedOnly: true,
        sort: 'name'
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
        if (vm.credentials && vm.credentials.userrole === 'team member pending') {
          var orgIndex = lodash.findIndex(vm.schoolOrgs, function(o) {
            return o.name === 'Unaffiliated/None';
          });
          if (orgIndex > -1) {
            vm.schoolOrgs.splice(orgIndex, 1);
          }
        }
      });
    };
    vm.findOrganizations();

    vm.roleFieldSelected = function(role) {
      if (role === 'team member pending') {
        vm.findOrganizations();
        vm.teamLeadSelected = false;
        vm.credentials.teamLeadType = undefined;
      } else if (role === 'team lead pending') {
        vm.teamLeadSelected = true;
        vm.schoolOrgSelected = false;
        vm.credentials.teamLead = undefined;
      }
      vm.findOrganizations();
    };

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

    // vm.openSchoolOrgForm = function() {
    //   vm.newSchoolOrg = new SchoolOrganizationsService();
    //   angular.element('#modal-org-editadd').modal('show');
    // };
    //
    // vm.saveSchoolOrgForm = function(newSchoolOrg) {
    //   vm.credentials.schoolOrg = 'new';
    //   vm.newSchoolOrg = angular.copy(newSchoolOrg);
    //   vm.credentials.addSchoolOrg = angular.copy(newSchoolOrg);
    //   vm.findOrganizations();
    //   angular.element('#modal-org-editadd').modal('hide');
    // };

    vm.openFormOrg = function() {
      vm.newSchoolOrg = new SchoolOrganizationsService();
      angular.element('#modal-org-edit').modal('show');
    };

    vm.closeFormOrg = function(newSchoolOrg) {
      angular.element('#modal-org-edit').modal('hide');
      if (newSchoolOrg) {
        vm.credentials.schoolOrg = 'new';
        vm.newSchoolOrg = angular.copy(newSchoolOrg);
        vm.credentials.addSchoolOrg = angular.copy(newSchoolOrg);
        vm.findOrganizations();
      }
    };

  }
]);
