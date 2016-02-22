(function () {
  'use strict';

  angular
    .module('units')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Units',
      state: 'units.list',
      roles: ['teacher']
    });
  }
})();
