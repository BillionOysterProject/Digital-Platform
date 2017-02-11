(function () {
  'use strict';

  angular
    .module('users')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  // Setting up route
  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('claim-user', {
        abstract: true,
        url: '/claim-user',
        template: '<ui-view/>'
      })
      .state('claim-user.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/authentication/claim-user-invalid.client.view.html',
        data: {
          pageTitle: 'Claim user token invalid'
        }
      })
      .state('claim-user.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/authentication/claim-user.client.view.html',
        data: {
          pageTitle: 'Claim user form'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
        data: {
          pageTitle: 'Password reset form'
        }
      });
  }

  getTeam.$inject = ['$stateParams', 'TeamsService'];

  function getTeam($stateParams, TeamsService) {
    return TeamsService.get({
      teamId: $stateParams.teamId
    }).$promise;
  }

  newTeam.$inject = ['TeamsService'];

  function newTeam(TeamsService) {
    return new TeamsService();
  }
})();
