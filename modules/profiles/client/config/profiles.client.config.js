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
      roles: ['*'],
      icon: 'fa fa-users',
      position: 4
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Profile',
      state: 'profiles'
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Teams',
      state: 'profiles.team'
    });

    //Menus.addSubMenuItem('topbar', 'profiles', {
    //  title: 'Team Leads',
    //  state: 'profiles.team-lead'
    //});

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Organizations',
      state: 'profiles.organization',
    });

    //Menus.addSubMenuItem('topbar', 'profiles', {
    //  title: 'Restoration Station',
    //  state: 'profiles.restoration-station',
    //});
  }
}());
