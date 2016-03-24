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
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('settings.admin-users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        data: {
          pageTitle: 'Users List',
          roles: ['admin']
        }
      })
      .state('settings.admin-user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        },
        data: {
          pageTitle: 'Edit {{ userResolve.displayName }}',
          roles: ['admin']
        }
      })
      .state('settings.admin-user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        },
        data: {
          pageTitle: 'Edit User {{ userResolve.displayName }}',
          roles: ['admin']
        }
      })
      .state('settings.admin-teams', {
        url: '/teams',
        templateUrl: 'modules/teams/client/views/list-teams.client.view.html',
        controller: 'TeamsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Teams List',
          roles: ['admin']
        }
      })
      .state('settings.admin-team-create', {
        url: '/teams/create',
        templateUrl: 'modules/teams/client/views/form-team.client.view.html',
        controller: 'TeamsController',
        controllerAs: 'vm',
        resolve: {
          teamResolve: newTeam
        },
        data: {
          pageTitle: 'Team Create',
          roles: ['admin', 'team lead']
        }
      })
      .state('settings.admin-team', {
        url: '/teams/:teamId',
        templateUrl: 'modules/teams/client/views/view-team.client.view.html',
        controller: 'TeamsController',
        controllerAs: 'vm',
        resolve: {
          teamResolve: getTeam
        },
        data: {
          pageTitle: 'Team {{ teamResolve.name }}',
          roles: ['admin', 'team lead']
        }
      })
      .state('settings.admin-team-owner', {
        url: '/team/',
        templateUrl: 'modules/teams/client/views/view-team.client.view.html',
        controller: 'TeamsController',
        controllerAs: 'vm',
        resolve: {
          teamResolve: getOwnerTeam
        },
        data: {
          pageTitle: 'Team {{ teamResolve.name }}',
          roles: ['team lead']
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
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
        data: {
          pageTitle: 'Signin'
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

  getOwnerTeam.$inject = ['$stateParams', 'TeamsService'];

  function getOwnerTeam($stateParams, TeamsService) {
    return TeamsService.owner.get().$promise;
  }

  getTeam.$inject = ['$stateParams', 'TeamsService'];

  function getTeam($stateParams, TeamsService) {
    return TeamsService.all.get({
      teamId: $stateParams.teamId
    }).$promise;
  }

  newTeam.$inject = ['TeamsService'];

  function newTeam(TeamsService) {
    return new TeamsService.all();
  }
})();
