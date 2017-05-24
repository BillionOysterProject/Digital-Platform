(function () {
  'use strict';

  angular
    .module('profiles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Community',
      state: 'profiles',
      type: 'dropdown',
      roles: ['user', 'team lead', 'team member', 'admin', 'team lead pending', 'team member pending'],
      icon: 'fa fa-users',
      position: 4
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'My Profile',
      state: 'profiles.main',
      roles: ['user', 'team lead', 'team member', 'admin', 'team lead pending', 'team member pending']
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Teams',
      state: 'profiles.team',
      roles: ['team lead', 'team member', 'admin', 'team lead pending', 'team member pending']
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Organizations',
      state: 'profiles.organization',
      roles: ['team lead', 'team member', 'admin', 'team lead pending', 'team member pending']
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'People',
      state: 'profiles.admin-users',
      roles: ['team lead', 'team member', 'admin']
    });
  }
}());
