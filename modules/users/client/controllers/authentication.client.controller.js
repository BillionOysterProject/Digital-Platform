'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$rootScope', '$state', '$http',
  '$location', '$window', 'lodash', 'Authentication', 'PasswordValidator', 'SchoolOrganizationsService',
  function ($scope, $rootScope, $state, $http,
    $location, $window, lodash, Authentication, PasswordValidator, SchoolOrganizationsService) {
    var vm = this;

    vm.credentials           = {};
    vm.authentication        = Authentication;
    vm.error                 = $location.search().err;
    vm.hasAcceptedTermsOfUse = false;
    vm.isSubmitting          = false;
    vm.newSchoolOrg          = new SchoolOrganizationsService();
    vm.popoverMsg            = PasswordValidator.getPopoverMsg();
    vm.prospectiveOrgs       = [];
    vm.schoolOrgs            = [];
    vm.schoolOrgSelected     = false;
    vm.teamLeads             = [];
    vm.teamLeadSelected      = false;
    vm.teamMemberSelected    = false;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    var fuzzySearch = function(response) {
      angular.forEach(response, function(v, k) {
        if (v.type === 'nyc-public') {
          if (v.syncId) {
            response[k].name = v.name + ' (' + v.syncId + ')';
          }
        }

        response[k]._search = response[k].name + ' ' + vm.normalizeSearch(response[k].name);
        response[k]._search = response[k]._search.replace(/(ps|ms|is)(0+)(\d+)/, '$1$2$3 $1$3');
        response[k]._search = response[k]._search.replace(/(jhs)(0+)(\d+)/, '$1$2$3 $1$3 ms$3');

        if (v.syncId) {
          try {
            response[k]._search += ' ' + v.syncId + ' ' + v.syncId.slice(3).replace(/^0/, '');
          } catch(e) { }
        }
      });

      return response;
    };

    vm.normalizeSearch = function(q) {
      try {
        q = q.toLowerCase();
        q = q.replace(/\s+and\s+/g, '');
        q = q.replace(/[\s\W]+/g, '');

        return q;
      } catch(e) {
        return q;
      }
    };

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

    vm.openFormOrg = function() {
      vm.newSchoolOrg = new SchoolOrganizationsService();
      angular.element('#modal-org-edit').modal('show');
    };

    vm.closeFormOrg = function(newSchoolOrg) {
      angular.element('#modal-org-edit').modal('hide');

      if (newSchoolOrg) {
        vm.credentials.schoolOrg = 'new';
        vm.newSchoolOrg = angular.copy(newSchoolOrg);

        vm.schoolOrgs.push(vm.newSchoolOrg);
        vm.schoolOrgObj = vm.newSchoolOrg;
      }
    };

    vm.schoolOrgFieldSelected = function(schoolOrg) {
      if (vm.credentials.userrole === 'team member pending') {
        vm.schoolOrgSelected = true;

        $http.get('/api/school-orgs/' + schoolOrg + '/team-leads').success(function(data) {
          vm.teamLeads = data;
        });
      } else {
        vm.schoolOrgSelected = false;
      }
    };

    $scope.$watch('vm.credentials.userrole', function() {
      vm.schoolOrgObj = null;
    });

    $scope.$watch('vm.schoolOrgObj', function(value){
      if (angular.isObject(vm.credentials)) {
        if (angular.isObject(value)) {
          vm.credentials.schoolOrg = value._id;
          vm.schoolOrgFieldSelected(vm.credentials.schoolOrg);
        } else {
          vm.credentials.schoolOrg = null;
        }

        console.debug('schoolOrg is now', vm.credentials.schoolOrg, vm.schoolOrgObj);
      }
    });

    // do things on load
    $http.get('/api/school-orgs?approvedOnly=true&sort=name').success(function(response) {
      response = fuzzySearch(response);
      vm.schoolOrgs = response;
    });

    $http.get('https://platform-beta.bop.nyc/api/prospective-orgs/?limit=10000&fields=name,syncId,type&sort=name').success(function(response) {
      response = fuzzySearch(response);
      vm.prospectiveOrgs = response;
    });
  }
]);
