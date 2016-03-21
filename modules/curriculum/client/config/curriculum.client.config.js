(function () {
  'use strict';

  angular
     .module('curriculum')
     .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Curriculum',
      state: 'lesson.list',
      type: 'dropdown',
      roles: ['user'],
      icon: 'glyphicon glyphicon-book',
    });

    Menus.addSubMenuItem('topbar', 'lesson.list', {
      title: 'Lessons',
      state: 'lesson.list',
      roles: ['user']
    });

    Menus.addSubMenuItem('topbar', 'lesson.list', {
      title: 'Units',
      state: 'unit.list',
      roles: ['team lead']
    });

    Menus.addSubMenuItem('topbar', 'lesson.list', {
      title: 'My Library',
      state: 'lesson.list',
      roles: ['team lead']
    });

    Menus.addSubMenuItem('topbar', 'lesson.list', {
      title: 'Glossary',
      state: 'lesson.list',
      roles: ['team lead']
    });
  }
})();
