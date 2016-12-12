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
      state: 'profiles.main'
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Teams',
      state: 'profiles.team'
    });

    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Organizations',
      state: 'profiles.organization'
    });

    //TIFF: This should go to the accounts page, but without the old Settings header/tabs. Only viewable to Admin
    //Menus.addSubMenuItem('topbar', 'profiles', {
    //  title: 'Accounts',
    //  state: 'settings.admin-users',
    //  roles: ['admin']
    //});
  }
}());
