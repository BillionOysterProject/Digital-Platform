(function () {
  'use strict';

  angular
    .module('lessons')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Lessons',
      state: 'lessons.list',
      roles: ['admin', 'team lead', 'team lead pending', 'partner'],
      position: 2
    });
  }
})();
