(function () {
  'use strict';

  angular
    .module('library')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'My Library',
      state: 'library.user',
      roles: ['team lead', 'admin'],
      position: 3
    });
  }
})();
