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
      roles: ['user', 'team lead', 'admin'],
      icon: 'glyphicon glyphicon-book',
      position: 1
    });

    Menus.addSubMenuItem('topbar', 'curriculum', {
      title: 'Overview',
      state: 'curriculum.overview',
      roles: ['team lead', 'admin'],
      position: 0
    });
  }
})();
