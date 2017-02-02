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
      state: 'profile',
      type: 'dropdown'
    });

    Menus.addSubMenuItem('account', 'profile', {
      title: 'Profile',
      state: 'profiles.main',
      roles: ['user']
    });
  }

})();
