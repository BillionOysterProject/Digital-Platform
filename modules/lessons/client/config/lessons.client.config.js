(function () {
  'use strict';

  angular
    .module('lessons')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addMenuItem('topbar', {
      title: 'Curriculum',
      state: 'lessons.list',
      roles: ['team lead'],
      icon: 'glyphicon glyphicon-book',
      position: 1
    });
  }
  
})();