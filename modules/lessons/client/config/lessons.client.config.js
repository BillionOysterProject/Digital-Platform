(function () {
  'use strict';

  angular
    .module('lessons')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Lesson',
      state: 'lessons.list',
      roles: ['team lead']
    });
  }
  
})();