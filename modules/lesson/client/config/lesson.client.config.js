(function () {
  'use strict';

  angular
    .module('lesson')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Lesson',
      state: 'lesson',
      roles: ['teacher']
    });
  }
})();
