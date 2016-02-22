(function () {
  'use strict';

  angular
    .module('curriculum')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Curriculum',
      state: 'curriculum',
      type: 'dropdown',
      roles: ['teacher']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Lesson',
      state: 'lesson',
      roles: ['teacher']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Units',
      state: 'unit',
      roles: ['teacher']
    });
  }
})();
