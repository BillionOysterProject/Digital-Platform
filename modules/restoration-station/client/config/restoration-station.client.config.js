(function () {
  'use strict';

  angular
    .module('restoration-station')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Restoration Station',
      state: 'restoration-station',
      roles: ['user']
    });
  }
})();
