(function () {
  'use strict';

  angular
    .module('units')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Units',
      state: 'units.list',
      roles: ['team lead', 'admin'],
      position: 1
    });
  }
})();
