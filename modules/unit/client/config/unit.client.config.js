(function () {
  'use strict';

  angular
    .module('unit')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Unit',
      state: 'unit',
      roles: ['teacher']
    });
  }
})();
