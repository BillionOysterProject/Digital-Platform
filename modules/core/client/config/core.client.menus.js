(function () {
  'use strict';

  angular
  .module('core')
  .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

    Menus.addMenu('account', {
      roles: ['user']
    });

    Menus.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Settings',
      state: 'settings.profile',
      roles: ['user']
    });


    // Menus.addSubMenuItem('account', 'settings', {
    //   title: 'Edit Profile',
    //   state: 'settings.profile'
    // });


    // Menus.addSubMenuItem('account', 'settings', {
    //   title: 'Edit Profile Picture',
    //   state: 'settings.picture'
    // });

    // Menus.addSubMenuItem('account', 'settings', {
    //   title: 'Change Password',
    //   state: 'settings.password'
    // });

    // Menus.addSubMenuItem('account', 'settings', {
    //   title: 'Manage Social Accounts',
    //   state: 'settings.accounts'
    // });

    // Menus.addSubMenuItem('account', 'settings', {
    //   title: 'Manage Users',
    //   state: 'admin.users',
    //   roles: ['admin']
    // });

  }

})();
