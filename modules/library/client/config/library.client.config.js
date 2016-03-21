(function () {
  'use strict';

  angular
    .module('library')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Library',
      state: 'library.main',
      icon: 'glyphicon glyphicon-cog',
      roles: ['team lead', 'admin'],
      position: 3
    });

    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'My Library',
      state: 'library.user',
      icon: 'glyphicon glyphicon-cog',
      roles: ['team lead'],
      position: 4
    });
  }
})();