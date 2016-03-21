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
       roles: ['team lead', 'admin'],
       icon: 'glyphicon glyphicon-book',
     });

     // Menus.addSubMenuItem('topbar', 'lessons.list', {
     //   title: 'My Library',
     //   state: 'lessons.list',
     //   icon: 'glyphicon glyphicon-cog',
     //   roles: ['team lead']
     // });

     // Menus.addSubMenuItem('topbar', 'lessons.list', {
     //   title: 'Glossary',
     //   state: 'lessons.list',
     //   icon: 'glyphicon glyphicon-cog',
     //   roles: ['team lead']
     // });
   }
})();
