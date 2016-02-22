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
  }
})();