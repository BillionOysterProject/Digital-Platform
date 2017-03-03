(function () {
  'use strict';

  angular
    .module('profiles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'People',
      state: 'profiles',
      type: 'dropdown',
      roles: ['user', 'team lead', 'team member', 'admin'],
      icon: 'fa fa-users',
      position: 4
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Profile',
      state: 'profiles.main',
      roles: ['user', 'team lead', 'team member', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Teams',
      state: 'profiles.team',
      roles: ['team lead', 'team member', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Organizations',
      state: 'profiles.organization',
      roles: ['team lead', 'team member', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Accounts',
      state: 'profiles.admin-users',
      roles: ['admin']
    });
  }
}());
