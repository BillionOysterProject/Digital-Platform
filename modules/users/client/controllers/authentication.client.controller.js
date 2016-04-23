'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window',
'lodash', 'Authentication', 'PasswordValidator', 'SchoolOrganizationsService',
  function ($scope, $state, $http, $location, $window, lodash, Authentication, PasswordValidator, SchoolOrganizationsService) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        var checkRole = function(role) {
          var teamLeadIndex = lodash.findIndex($scope.authentication.user.roles, function(o) {
            return o === role;
          });
          return (teamLeadIndex > -1) ? true : false;
        };

        var dashboard = (checkRole('team lead') || checkRole('team lead pending')) ?
          'curriculum.overview' : 'restoration-stations.dashboard';

        //$state.go($state.previous.state.name || 'home', $state.previous.params);
        $state.go(dashboard);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };

    // Team Member Request
    $scope.schoolOrgs = [];
    $scope.teamMemberSelected = false;
    $scope.teamLeads = [];
    $scope.schoolOrgSelected = false;
    $scope.newSchoolOrg = new SchoolOrganizationsService();

    $scope.findOrganizations = function (newOrg) {
      SchoolOrganizationsService.query({
        approvedOnly: true
      }, function(data) {
        $scope.schoolOrgs = [];
        for (var i = 0; i < data.length; i++) {
          $scope.schoolOrgs.push({
            '_id' : data[i]._id,
            'name' : data[i].name
          });
        }
        if ($scope.newSchoolOrg && $scope.newSchoolOrg.name) {
          console.log('adding new org to dropdown', $scope.newSchoolOrg);
          $scope.schoolOrgs.push({
            '_id' : '0',
            'name' : $scope.newSchoolOrg.name
          });
        }
        console.log('$scope.schoolOrgs', $scope.schoolOrgs);
      });
    };
    $scope.findOrganizations();

    $scope.schoolOrgFieldSelected = function(schoolOrgId) {
      if (schoolOrgId && $scope.credentials.userrole === 'team member pending') {
        $scope.schoolOrgSelected = true;
        $http.get('/api/school-orgs/' + schoolOrgId + '/team-leads').success(function (response) {
          console.log('teamLeads', response);
          $scope.teamLeads = response;
        }).error(function (response) {
          console.log('teamLeads', response);
        });
      } else {
        $scope.schoolOrgSelected = false;
      }
    };

    $scope.openSchoolOrgForm = function() {
      $scope.newSchoolOrg = new SchoolOrganizationsService();
      angular.element('#modal-org-editadd').modal('show');
    };

    $scope.saveSchoolOrgForm = function(newSchoolOrg) {
      console.log('$scope.credentials.userrole', $scope.credentials.userrole);
      $scope.credentials.schoolOrg = '0';
      $scope.newSchoolOrg = angular.copy(newSchoolOrg);
      $scope.findOrganizations();
      console.log('newSchoolOrg', $scope.newSchoolOrg);
      console.log('schoolOrg', $scope.credentials.schoolOrg);
      angular.element('#modal-org-editadd').modal('hide');
    };

    $scope.cancelSchoolOrgForm = function() {
      $scope.newSchoolOrg = {};
      angular.element('#modal-org-editadd').modal('hide');
    };
  }
]);
