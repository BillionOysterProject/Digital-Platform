'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'lodash', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, lodash, Authentication, PasswordValidator) {
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

    $http.get('/api/school-orgs').success(function (response) {
      $scope.schoolOrgs = response;
    }).error(function (response) {
    });

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
  }
]);
