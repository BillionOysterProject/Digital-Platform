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
      roles: ['admin', 'team lead', 'team lead pending', 'partner'],
      position: 1
    });
  }
})();
